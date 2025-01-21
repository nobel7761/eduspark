"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import { allStudentsList } from "../../../../public/data/students";
import Image from "next/image";

const StudentDetailsComponent = () => {
  const params = useParams();
  const student = allStudentsList.find((s) => s.studentId === params.studentId);

  if (!student) {
    return <div>Student not found</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 gap-4">
        <Link
          href="/students"
          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          ← Back to Students
        </Link>
        <Link
          href={`/students/edit/${student.studentId}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Student
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Personal Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {student.firstName}{" "}
              {student.lastName}
            </p>
            <p>
              <span className="font-medium">Student ID:</span>{" "}
              {student.studentId}
            </p>
            <p>
              <span className="font-medium">Class:</span> {student.class}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {student.sex}
            </p>
            <p>
              <span className="font-medium">Institute:</span>{" "}
              {student.institute}
            </p>
            <p>
              <span className="font-medium">Admission Date:</span>{" "}
              {student.admissionDate}
            </p>
          </div>
        </div>

        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Contact Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Primary Phone:</span>{" "}
              {student.primaryPhone}
            </p>
            <p>
              <span className="font-medium">Secondary Phone:</span>{" "}
              {student.secondaryPhone}
            </p>
            <p>
              <span className="font-medium">Present Address:</span>{" "}
              {student.presentAddress}
            </p>
            <p>
              <span className="font-medium">Permanent Address:</span>{" "}
              {student.permanentAddress}
            </p>
          </div>
        </div>

        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Father&apos;s Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {student.fatherName}
            </p>
            <p>
              <span className="font-medium">Occupation:</span>{" "}
              {student.fatherOccupation}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {student.fatherPhone}
            </p>
          </div>
        </div>

        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Mother&apos;s Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {student.motherName}
            </p>
            <p>
              <span className="font-medium">Occupation:</span>{" "}
              {student.motherOccupation}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {student.motherPhone}
            </p>
          </div>
        </div>

        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Referral Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Referred By:</span>{" "}
              {student.referredBy.name}
            </p>
            <p>
              <span className="font-medium">Referrer&apos;s Phone:</span>{" "}
              {student.referredBy.phone}
            </p>
          </div>
        </div>

        {student.photo && (
          <div className="border border-primary p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              Student Photo
            </h2>
            <Image
              src={student.photo}
              alt={`${student.firstName} ${student.lastName}`}
              width={192}
              height={192}
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsComponent;
