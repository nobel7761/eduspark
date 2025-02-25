import { Gender, Group, PaymentMethod } from "@/enums/common.enum";
import { EmployeeType } from "@/enums/employees.enum";

export interface IClass {
  _id?: string;
  name: string;
  subjects: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IPaymentPerClass {
  classes: IClass[];
  amount: number;
  _id?: string;
}

export interface IParentInfo {
  name?: string;
  phone?: string;
}

export interface IEducationalInstitute {
  institute: string;
  group: Group | null;
  year: number;
  result: number;
}

export interface IUniversityInfo {
  institute: string;
  department: string;
  admissionYear?: number | null;
  passingYear?: number | null;
  cgpa?: number | null;
}

export interface IEducationalBackground {
  university: IUniversityInfo;
  hsc: IEducationalInstitute;
  ssc: IEducationalInstitute;
}

export interface IEmployee {
  _id?: string;
  // Personal Information
  firstName: string;
  lastName: string;
  shortName?: string;
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
  father?: IParentInfo;
  mother?: IParentInfo;

  isCurrentlyStudying?: boolean;

  // Educational Background
  educationalBackground?: IEducationalBackground;

  // Payment Information
  paymentMethod: PaymentMethod;
  paymentPerClass?: IPaymentPerClass[];
  paymentPerMonth?: number;
}

export type IEmployeeWithoutId = Omit<IEmployee, "employeeId">;
