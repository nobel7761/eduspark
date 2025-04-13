"use client";

import StepperForm from "@/components/UI/StepperForm/StepperForm";
import PersonalInfoStep from "./steps/PersonalInfo";
import EducationStep from "./steps/EducationInfo";
import ParentsInfoStep from "./steps/ParentsInfo";
import ReferralInfoStep from "./steps/ReferralInfo";
import { FormData } from "@/types/stepperForm";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const CreateStudentComponent = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = useCallback(async (data?: FormData) => {
    try {
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create student");
      }

      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
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
      setLoading(true);
      const response = await callApi(data);

      if (response) {
        toast.success("Student created successfully!", {
          onClose: () => {
            router.push("/students");
          },
        });
      }
    } catch (err) {
      console.error("Error creating student:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create student"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary p-1 md:p-4 rounded-md text-white">
      <h1 className="text-lg font-semibold text-center md:text-left lg:text-left py-3 md:py-0 lg:py-0">
        Create Student
      </h1>
      <StepperForm
        steps={steps}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        error={error?.message}
      />
    </div>
  );
};

export default CreateStudentComponent;
