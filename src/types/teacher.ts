import { Gender, Group } from "@/enums/common.enum";
import { PaymentMethod } from "@/enums/teachers.enum";

export interface ITeacher {
  // Personal Information
  firstName: string;
  lastName: string;
  gender: Gender;
  joiningDate: Date;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string | null;
  nidNumber?: string;
  teacherId: string;
  comments?: string;
  // Address Information
  presentAddress: string;
  permanentAddress?: string;

  // Parents Information
  father: {
    name: string;
    phone: string;
  };
  mother: {
    name: string;
    phone: string;
  };

  isCurrentlyStudying: boolean;

  // Educational Background
  educationalBackground: {
    university: {
      institute: string;
      department: string;
      admissionYear?: number | null;
      passingYear?: number | null;
      cgpa?: number | null;
    };
    hsc: {
      institute: string;
      group: Group | null;
      year: number;
      result: number;
    };
    ssc: {
      institute: string;
      group: Group | null;
      year: number;
      result: number;
    };
  };

  // Payment Information
  paymentMethod: PaymentMethod;
  paymentPerClass?: number;
  paymentPerMonth?: number;
}

export type ITeacherWithoutId = Omit<ITeacher, "teacherId">;
