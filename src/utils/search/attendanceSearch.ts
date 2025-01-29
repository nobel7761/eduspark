import { AttendanceRecord } from "@/components/page/Attendance/AttendanceComponent";

export const attendanceSearchableFields: (keyof AttendanceRecord)[] = [
  "name",
  "designation",
  "date",
  "status",
  "comments",
];

// Search function that checks all specified fields
export const searchAttendance = (
  attendance: AttendanceRecord,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase().trim();

  return attendanceSearchableFields.some((field) => {
    const value = attendance[field];
    return value?.toString().toLowerCase().includes(term);
  });
};
