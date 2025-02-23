import { IStudent } from "@/types/student";

export const studentSearchableFields: (keyof IStudent | string)[] = [
  "firstName",
  "lastName",
  "presentAddress",
  "permanentAddress",
  "institute",
  "phoneNumber",
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
export const getNestedValue = <T extends object>(
  obj: T,
  path: string
): unknown => {
  return path.split(".").reduce<unknown>((acc, part) => {
    return (acc as Record<string, unknown>)?.[part];
  }, obj);
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
