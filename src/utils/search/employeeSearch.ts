import { getNestedValue } from "./studentSearch";
import { IEmployee } from "@/types/employee";
export const employeeSearchableFields: (keyof IEmployee | string)[] = [
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

export const searchEmployee = (
  employee: IEmployee,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase().trim();

  return employeeSearchableFields.some((field) => {
    const value = getNestedValue(employee, field as string);
    return value?.toString().toLowerCase().includes(term);
  });
};
