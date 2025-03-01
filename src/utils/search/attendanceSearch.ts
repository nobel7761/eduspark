import { AttendanceRecord } from "@/components/page/Attendance/AttendanceComponent";

export const attendanceSearchableFields: (keyof AttendanceRecord | string)[] = [
  "employeeId.firstName",
  "employeeId.lastName",
  "employeeId.employeeType",
  "date",
  "comments",
];

// Helper function to get nested object values
const getNestedValue = (obj: AttendanceRecord, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

// Search function that checks all specified fields
export const searchAttendance = (
  attendance: AttendanceRecord,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase().trim();

  return attendanceSearchableFields.some((field) => {
    const value = getNestedValue(attendance, field);
    if (field === "employeeId.firstName" || field === "employeeId.lastName") {
      const fullName = `${attendance.employeeId.firstName} ${attendance.employeeId.lastName}`;
      return fullName.toLowerCase().includes(term);
    }
    return value?.toString().toLowerCase().includes(term);
  });
};
