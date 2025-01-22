export enum PaymentType {
  FIXED = "FIXED",
  CLASS_BASED = "CLASS_BASED",
}

export interface ITeacher {
  firstName: string;
  lastName: string;
  primaryPhone: string;
  secondaryPhone: string;
  paymentType: PaymentType;
  nidNumber: string;
  photo: string;
  teacherId: string;
  address: string;
  educationalBackground: {
    sscInstitute: string;
    sscPassingYear: string;
    sscGroup: string;
    hscInstitute: string;
    hscPassingYear: string;
    hscGroup: string;
  };
}
