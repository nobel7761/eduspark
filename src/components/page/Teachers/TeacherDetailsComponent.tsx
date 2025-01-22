"use client";

import { useParams } from "next/navigation";
import React from "react";
import { allTeachersList } from "../../../../public/data/teachers";
import Link from "next/link";
import Image from "next/image";

const TeacherDetailsComponent = () => {
  const params = useParams();
  const teacher = allTeachersList.find((s) => s.teacherId === params.teacherId);

  if (!teacher) {
    return <div>Teacher not found</div>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 gap-4">
        <Link
          href="/teachers"
          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          ← Back to Teachers
        </Link>
        <Link
          href={`/teachers/edit/${teacher.teacherId}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Teacher
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Teacher Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Personal Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {teacher.firstName}{" "}
              {teacher.lastName}
            </p>
            <p>
              <span className="font-medium">Teacher ID:</span>{" "}
              {teacher.teacherId}
            </p>
            <p>
              <span className="font-medium">NID Number:</span>{" "}
              {teacher.nidNumber}
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
              {teacher.primaryPhone}
            </p>
            <p>
              <span className="font-medium">Secondary Phone:</span>{" "}
              {teacher.secondaryPhone}
            </p>
            <p>
              <span className="font-medium">Address:</span> {teacher.address}
            </p>
          </div>
        </div>

        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Educational Background
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">SSC Institute:</span>{" "}
              {teacher.educationalBackground.sscInstitute}
            </p>
            <p>
              <span className="font-medium">SSC Group:</span>{" "}
              {teacher.educationalBackground.sscGroup}
            </p>
            <p>
              <span className="font-medium">SSC Passing Year:</span>{" "}
              {teacher.educationalBackground.sscPassingYear}
            </p>
            <p>
              <span className="font-medium">HSC Institute:</span>{" "}
              {teacher.educationalBackground.hscInstitute}
            </p>
            <p>
              <span className="font-medium">HSC Group:</span>{" "}
              {teacher.educationalBackground.hscGroup}
            </p>
            <p>
              <span className="font-medium">HSC Passing Year:</span>{" "}
              {teacher.educationalBackground.hscPassingYear}
            </p>
          </div>
        </div>

        {teacher.photo && (
          <div className="border border-primary p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              Teacher Photo
            </h2>
            <Image
              src={teacher.photo}
              alt={`${teacher.firstName} ${teacher.lastName}`}
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

export default TeacherDetailsComponent;
