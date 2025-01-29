"use client";

import StepperForm from "@/components/UI/StepperForm/StepperForm";

import PersonalInfoStep from "./steps/PersonalInfo";

import EducationStep from "./steps/EducationInfo";
import ParentsInfoStep from "./steps/ParentsInfo";
import ReferralInfoStep from "./steps/ReferralInfo";

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  photo: FileList;
  dateOfBirth: Date;
  gender: "Male" | "Female";
  religion: "Islam" | "Hinduism" | "Christianity" | "Buddhism";
  primaryPhone: string;
  secondaryPhone: string;

  // Education Info
  instituteName: string;
  class: string;
  presentAddress: string;
  permanentAddress: string;

  // Parents Info
  father: {
    name: string;
    occupation: string;
    phone: string;
  };
  mother: {
    name: string;
    occupation: string;
    phone: string;
  };

  // Referral Info
  referredBy: {
    name: string;
    phone: string;
  };
}

const CreateStudentComponent = () => {
  const steps = [
    {
      id: 1,
      title: "Personal Information",
      component: <PersonalInfoStep />,
    },
    {
      id: 2,
      title: "Education & Address",
      component: <EducationStep />,
    },
    {
      id: 3,
      title: "Parents Information",
      component: <ParentsInfoStep />,
    },
    {
      id: 4,
      title: "Referral Information",
      component: <ReferralInfoStep />,
    },
  ];

  const handleSubmit = (data: any) => {
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
