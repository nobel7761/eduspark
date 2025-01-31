export enum StudentClass {
  DRAWING = "drawing",
  ARABIC = "arabic",
  SPOKEN_ENGLISH = "spoken_english",
  CLASS_3 = 3,
  CLASS_4 = 4,
  CLASS_5 = 5,
  CLASS_6 = 6,
  CLASS_7 = 7,
  CLASS_8 = 8,
  CLASS_9 = 9,
  CLASS_10 = 10,
  CLASS_11 = 11,
  CLASS_12 = 12,
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum Religion {
  ISLAM = "islam",
  CHRISTIANITY = "christianity",
  HINDUISM = "hinduism",
  BUDDHISM = "buddhism",
}

export interface IStudent {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  religion: Religion;
  primaryPhone: string;
  secondaryPhone?: string;
  instituteName: string;
  class: string;
  group?: string;
  subjects?: Array<{ value: string; label: string }>;
  presentAddress: string;
  permanentAddress?: string;
  father: {
    name: string;
    phone: string;
    occupation?: string;
  };
  mother: {
    name: string;
    phone: string;
    occupation?: string;
  };
  referredBy?: {
    name: string;
    phone: string;
  };
  payment: {
    admissionFee: number;
    formFee: number;
    monthlyFee: number;
    packageFee: number;
    referrerFee?: number;
    comments?: string;
  };
  createdAt?: string;
  studentId: string;
}
