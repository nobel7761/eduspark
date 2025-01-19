export enum StudentClass {
  DRAWING = "drawing",
  ARABIC = "arabic",
  SPOKEN_ENGLISH = "spoken_english",
  CLASS_1 = 1,
  CLASS_2 = 2,
  CLASS_3 = 3,
  CLASS_4 = 4,
  CLASS_5 = 5,
  CLASS_6 = 6,
  CLASS_7 = 7,
  CLASS_8 = 8,
  CLASS_9 = 9,
  CLASS_10 = 10,
}

export enum Sex {
  MALE = "male",
  FEMALE = "female",
}

export interface IStudent {
  firstName: string;
  lastName: string;
  class: number | string;
  sex: Sex;
  presentAddress: string;
  permanentAddress: string;
  institute: string;
  primaryPhone: string;
  secondaryPhone: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  studentId: string;
  photo: string;
  referredBy: {
    name: string;
    phone: string;
  };
  admissionDate: string;
}
