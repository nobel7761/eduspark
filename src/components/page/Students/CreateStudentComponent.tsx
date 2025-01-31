"use client";

import StepperForm from "@/components/UI/StepperForm/StepperForm";

import PersonalInfoStep from "./steps/PersonalInfo";

import EducationStep from "./steps/EducationInfo";
import ParentsInfoStep from "./steps/ParentsInfo";
import ReferralInfoStep from "./steps/ReferralInfo";
import { FormData } from "@/types/stepperForm";

const CreateStudentComponent = () => {
  const steps = [
    {
      id: 1,
      title: "Personal",
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

  const handleSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="bg-primary p-4 rounded-md text-white">
      <h1 className="text-lg font-semibold">Create Student</h1>
      <StepperForm steps={steps} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateStudentComponent;
