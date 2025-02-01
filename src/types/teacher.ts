import { Gender, PaymentMethod } from "@/enums/teachers.enum";

export interface ITeacher {
  _id: string;
  name: string;
  teacherId: string;
  gender: Gender;
  primaryPhone: string;
  secondaryPhone?: string;
  photo?: string;
  attachments?: Array<{
    [key: string]: string;
  }>;
  email?: string;
  nidNumber?: string;
  presentAddress: string;
  permanentAddress?: string;
  father: {
    name: string;
    phone: string;
  };
  mother?: {
    name: string;
    phone: string;
  };
  paymentMethod: PaymentMethod;
  paymentPerClass: number | null;
  paymentPerMonth: number | null;
  isRunningStudent: boolean;
  educationalBackground: {
    university: {
      institute: string;
      department: string;
      admissionYear?: number | null;
      passingYear?: number | null;
      cgpa?: number | null;
    };
    ssc: {
      year: number;
      group: string;
      result: number;
      institute: string;
    };
    hsc: {
      year: number;
      group: string;
      result: number;
      institute: string;
    };
  };
}
