import { Gender, Group, PaymentMethod } from "@/enums/common.enum";
import { EmployeeType } from "@/enums/employees.enum";

export interface IEmployee {
  // Personal Information
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  joiningDate: Date;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string | null;
  nidNumber?: string;
  employeeId: string;
  comments?: string;
  employeeType: EmployeeType;
  // Address Information
  presentAddress: string;
  permanentAddress?: string;

  // Parents Information
  father?: {
    name?: string;
    phone?: string;
  };
  mother?: {
    name: string;
    phone: string;
  };

  isCurrentlyStudying?: boolean;

  // Educational Background
  educationalBackground?: {
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
  paymentPerClass?: Array<{
    classes: string[];
    amount: number;
  }>;
  paymentPerMonth?: number;
}

export type IEmployeeWithoutId = Omit<IEmployee, "employeeId">;
