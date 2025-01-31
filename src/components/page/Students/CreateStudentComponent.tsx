"use client";

import StepperForm from "@/components/UI/StepperForm/StepperForm";
import PersonalInfoStep from "./steps/PersonalInfo";
import EducationStep from "./steps/EducationInfo";
import ParentsInfoStep from "./steps/ParentsInfo";
import ReferralInfoStep from "./steps/ReferralInfo";
import { FormData } from "@/types/stepperForm";
import { useRouter } from "next/navigation";
import SuccessPopup from "@/components/UI/SuccessPopup";
import FailedPopup from "@/components/UI/FailedPopup";
import { useCallback, useState } from "react";
import { IStudent } from "@/types/student";

const CreateStudentComponent = () => {
  const router = useRouter();
  const [openSuccessPopup, setOpenSuccessPopup] = useState<boolean>(false);
  const [openFailedPopup, setOpenFailedPopup] = useState<boolean>(false);

  const [createdData, setCreatedData] = useState<{ data: IStudent } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = useCallback(async (data?: FormData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const result = await response.json();
      setCreatedData(result);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const steps = [
    {
      id: 1,
      title: "Personal ",
      component: <PersonalInfoStep />,
    },
    {
      id: 2,
      title: "Education & Address",
      component: <EducationStep />,
    },
    {
      id: 3,
      title: "Parents",
      component: <ParentsInfoStep />,
    },
    {
      id: 4,
      title: "Referral & Payments",
      component: <ReferralInfoStep />,
    },
  ];

  const handleSubmit = async (data: FormData) => {
    try {
      callApi(data);
      if (createdData) {
        setOpenSuccessPopup(true);
        setTimeout(() => {
          router.push("/students");
        }, 2000);
      } else {
        setOpenFailedPopup(true);
      }
    } catch (err) {
      console.error("Error creating student:", err);
      setOpenFailedPopup(true);
    }
  };

  return (
    <div className="bg-primary p-4 rounded-md text-white">
      <h1 className="text-lg font-semibold">Create Student</h1>
      <StepperForm
        steps={steps}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        error={error?.message}
      />

      <SuccessPopup
        isOpen={openSuccessPopup}
        onClose={() => setOpenSuccessPopup(false)}
        message={
          "Student created successfully. You will be redirected to the students list page."
        }
      />
      <FailedPopup
        isOpen={openFailedPopup}
        onClose={() => setOpenFailedPopup(false)}
        message={"Failed to create student"}
      />
    </div>
  );
};

export default CreateStudentComponent;
