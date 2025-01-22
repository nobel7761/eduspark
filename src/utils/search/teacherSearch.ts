import { ITeacher } from "@/types/teacher";
import { getNestedValue } from "./studentSearch";

export const teacherSearchableFields: (keyof ITeacher | string)[] = [
  "firstName",
  "lastName",
  "address",
  "primaryPhone",
  "secondaryPhone",
  "paymentType",
  "nidNumber",
  "educationalBackground.degree",
  "educationalBackground.institution",
];

export const searchTeacher = (
  teacher: ITeacher,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase().trim();

  return teacherSearchableFields.some((field) => {
    const value = getNestedValue(teacher, field as string);
    return value?.toString().toLowerCase().includes(term);
  });
};
