import { IStudent } from "@/types/student";

export const studentSearchableFields: (keyof IStudent | string)[] = [
  "firstName",
  "lastName",
  "presentAddress",
  "permanentAddress",
  "institute",
  "primaryPhone",
  "secondaryPhone",
  "fatherName",
  "fatherOccupation",
  "fatherPhone",
  "motherName",
  "motherOccupation",
  "studentId",
  "referredBy.name",
  "referredBy.phone",
];

// Helper function to get nested object values
export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Search function that checks all specified fields
export const searchStudent = (
  student: IStudent,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase().trim();

  return studentSearchableFields.some((field) => {
    const value = getNestedValue(student, field as string);
    return value?.toString().toLowerCase().includes(term);
  });
};
