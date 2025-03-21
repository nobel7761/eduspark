export interface FormData {
  name: string;
  dateOfBirth: Date;
  admissionDate: Date;
  gender: "Male" | "Female";
  religion: "Islam" | "Hinduism" | "Christianity" | "Buddhism";
  phoneNumber?: string;
  instituteName: string;
  class: string;
  group?: string;
  subjects?: Array<{ value: string; label: string }>;
  presentAddress: string;
  permanentAddress: string;
  father: {
    name: string;
    phone: string;
    occupation: string;
  };
  mother: {
    name: string;
    phone: string;
    occupation: string;
  };
  referredBy: {
    name: string;
    phone: string;
  };
  payment: {
    admissionFee: number;
    formFee: number;
    monthlyFee: number;
    packageFee: number;
    referrerFee: number;
    comments?: string;
  };
  photo?: File;
}

export interface StepperFormProps {
  steps: {
    id: number;
    title: string;
    component: React.ReactNode;
  }[];
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  error?: string;
}

export type FormFields =
  | keyof FormData
  | "father.name"
  | "father.phone"
  | "mother.name"
  | "mother.phone"
  | "payment.admissionFee"
  | "payment.formFee"
  | "payment.monthlyFee"
  | "payment.packageFee";
