"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import { allStudentsList } from "../../../../public/data/students";

const StudentDetailsComponent = () => {
  const params = useParams();
  const student = allStudentsList.find((s) => s.studentId === params.studentId);

  if (!student) {
    return <div>Student not found</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Link
          href="/students"
          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          ← Back to Students
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p>
            Name: {student.firstName} {student.lastName}
          </p>
          <p>Student ID: {student.studentId}</p>
          <p>Class: {student.class}</p>
          <p>Gender: {student.sex}</p>
          <p>Institute: {student.institute}</p>
          {/* Add more fields as needed */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p>Primary Phone: {student.primaryPhone}</p>
          <p>Secondary Phone: {student.secondaryPhone}</p>
          <p>Present Address: {student.presentAddress}</p>
          <p>Permanent Address: {student.permanentAddress}</p>
        </div>
        {/* Add more sections for parent information, etc. */}
      </div>
    </div>
  );
};

export default StudentDetailsComponent;
