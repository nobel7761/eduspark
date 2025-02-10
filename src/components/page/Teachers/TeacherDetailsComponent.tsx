"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ITeacher } from "@/types/teacher";
import { PaymentMethod } from "@/enums/teachers.enum";
import {
  FaUser,
  FaPhone,
  FaDollarSign,
  FaUsers,
  FaGraduationCap,
  FaComment,
} from "react-icons/fa";

const TeacherDetailsComponent = () => {
  const params = useParams();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/teachers/${params.teacherId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch teacher");
      }
      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  console.log(teacher);

  useEffect(() => {
    if (params.teacherId) {
      fetchTeacher();
    }
  }, [params.teacherId]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-primary text-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Teacher Details</h1>
        <div className="flex gap-4">
          <Link
            href="/office-assistant/teachers"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back to Teachers
          </Link>
          <Link
            href={`/office-assistant/teachers/edit/${teacher?.teacherId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Teacher
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Contact Section */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <FaUser className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Name"
                value={`${teacher?.firstName} ${teacher?.lastName}`}
              />
              <InfoItem label="Gender" value={teacher?.gender} />
              <InfoItem label="Teacher ID" value={teacher?.teacherId} />
              <InfoItem label="NID" value={teacher?.nidNumber || "-"} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <FaPhone className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <InfoItem label="Primary Phone" value={teacher?.primaryPhone} />
              <InfoItem
                label="Secondary Phone"
                value={teacher?.secondaryPhone || "-"}
              />
              <InfoItem label="Email" value={teacher?.email || "-"} />
              <InfoItem
                label="Present Address"
                value={teacher?.presentAddress}
              />
              <InfoItem
                label="Permanent Address"
                value={teacher?.permanentAddress || "-"}
              />
            </div>
          </div>
        </div>

        {/* Payment & Parents Section */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <FaDollarSign className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Joining Date"
                value={
                  teacher?.joiningDate
                    ? new Date(teacher.joiningDate).toLocaleDateString()
                    : "-"
                }
              />
              <InfoItem label="Payment Method" value={teacher?.paymentMethod} />
              {teacher?.paymentMethod === PaymentMethod.PerClass && (
                <InfoItem
                  label="Payment Per Class"
                  value={`${teacher?.paymentPerClass} BDT`}
                />
              )}
              {teacher?.paymentMethod === PaymentMethod.Monthly && (
                <InfoItem
                  label="Payment Per Month"
                  value={`${teacher?.paymentPerMonth} BDT`}
                />
              )}
            </div>
          </div>

          {/* Parents Information - Modified for full height */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6 flex-1">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <FaUsers className="w-5 h-5" />
              Parents Information
            </h2>
            <div className="grid grid-cols-1 gap-4 h-full">
              <div className="border-b pb-3 flex-1">
                <h3 className="font-medium text-gray-700 mb-2">
                  Father&apos;s Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Name" value={teacher?.father?.name} />
                  <InfoItem label="Phone" value={teacher?.father?.phone} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700 mb-2">
                  Mother&apos;s Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Name" value={teacher?.mother?.name} />
                  <InfoItem label="Phone" value={teacher?.mother?.phone} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Background - Full Width */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
            <FaGraduationCap className="w-5 h-5" />
            Educational Background
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* University Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-3">
                University Information
              </h3>
              <div className="space-y-2">
                <InfoItem
                  label="Institute"
                  value={teacher?.educationalBackground?.university?.institute}
                />
                <InfoItem
                  label="Department"
                  value={teacher?.educationalBackground?.university?.department}
                />
                {teacher?.isCurrentlyStudying ? (
                  <InfoItem
                    label="Admission Year"
                    value={
                      teacher?.educationalBackground?.university?.admissionYear
                    }
                  />
                ) : (
                  <>
                    <InfoItem
                      label="Passing Year"
                      value={
                        teacher?.educationalBackground?.university?.passingYear
                      }
                    />
                    <InfoItem
                      label="CGPA"
                      value={teacher?.educationalBackground?.university?.cgpa}
                    />
                  </>
                )}
              </div>
            </div>

            {/* HSC Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-3">HSC Information</h3>
              <div className="space-y-2">
                <InfoItem
                  label="Institute"
                  value={teacher?.educationalBackground?.hsc?.institute}
                />
                <InfoItem
                  label="Group"
                  value={teacher?.educationalBackground?.hsc?.group}
                />
                <InfoItem
                  label="Passing Year"
                  value={teacher?.educationalBackground?.hsc?.year}
                />
                <InfoItem
                  label="GPA"
                  value={teacher?.educationalBackground?.hsc?.result}
                />
              </div>
            </div>

            {/* SSC Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-3">SSC Information</h3>
              <div className="space-y-2">
                <InfoItem
                  label="Institute"
                  value={teacher?.educationalBackground?.ssc?.institute}
                />
                <InfoItem
                  label="Group"
                  value={teacher?.educationalBackground?.ssc?.group}
                />
                <InfoItem
                  label="Passing Year"
                  value={teacher?.educationalBackground?.ssc?.year}
                />
                <InfoItem
                  label="GPA"
                  value={teacher?.educationalBackground?.ssc?.result}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
            <FaComment className="w-5 h-5" />
            Comments
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {teacher?.comments || "No comments available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent info display
const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | Date | null | undefined;
}) => {
  const displayValue =
    value instanceof Date ? value.toLocaleDateString() : String(value || "-");
  return (
    <div>
      <span className="text-sm text-gray-600 font-bold">{label}</span>
      <p className="text-gray-700 font-light">{displayValue}</p>
    </div>
  );
};

export default TeacherDetailsComponent;
