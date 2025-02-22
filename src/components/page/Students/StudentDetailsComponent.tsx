"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IStudent } from "@/types/student";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstCharacter";

const StudentDetailsComponent = () => {
  const params = useParams();
  const [student, setStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/students/${params.studentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.studentId) {
      fetchStudent();
    }
  }, [params.studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-500 text-xl">⚠️ {error.message}</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-gray-500 text-xl">No student data found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-primary rounded-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Student Profile
          <span className="block text-sm text-white mt-1">
            ID: {student.studentId}
          </span>
        </h1>
        <div className="flex gap-4">
          <Link
            href="/students"
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Students
          </Link>
          <Link
            href={`/students/edit/${student.studentId}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">👤</span> Personal Information
            </h2>
            <div className="space-y-3">
              <InfoRow label="Full Name" value={student.name} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Religion" value={student.religion || "N/A"} />
              <InfoRow
                label="Date of Birth"
                value={
                  student.dateOfBirth
                    ? new Date(student.dateOfBirth)
                        .toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        .replace(/(\d+)/, (match) => {
                          const day = parseInt(match);
                          return `${day}`;
                        })
                    : "N/A"
                }
              />
              <InfoRow
                label="Admission Date"
                value={
                  student.createdAt
                    ? new Date(student.createdAt)
                        .toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        .replace(/(\d+)/, (match) => {
                          const day = parseInt(match);
                          return `${day}`;
                        })
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">📞</span> Contact Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Primary Phone"
                value={student.primaryPhone || "N/A"}
              />
              <InfoRow
                label="Secondary Phone"
                value={student.secondaryPhone || "N/A"}
              />
              <InfoRow
                label="Present Address"
                value={student.presentAddress || "N/A"}
              />
              <InfoRow
                label="Permanent Address"
                value={student.permanentAddress || "N/A"}
              />
            </div>
          </div>
        </div>

        {/* Parents Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">👨‍👩‍👧‍👦</span> Parents Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Father
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Name" value={student.father.name} />
                  <InfoRow
                    label="Occupation"
                    value={student.father.occupation || "N/A"}
                  />
                  <InfoRow label="Phone" value={student.father.phone} />
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Mother
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Name" value={student.mother.name} />
                  <InfoRow
                    label="Occupation"
                    value={student.mother.occupation || "N/A"}
                  />
                  <InfoRow label="Phone" value={student.mother.phone} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">🤝</span> Referral Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Referred By"
                value={student.referredBy?.name || "N/A"}
              />
              <InfoRow
                label="Referrer's Phone"
                value={student.referredBy?.phone || "N/A"}
              />
            </div>
          </div>
        </div>

        {/* Education Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">📚</span> Education
            </h2>
            <div className="space-y-3">
              <InfoRow label="Institute" value={student.instituteName} />
              <InfoRow label="Class" value={student.class} />
              {student.group && (
                <InfoRow
                  label="Group"
                  value={capitalizeFirstLetter(student.group)}
                />
              )}
              {student.subjects && student.subjects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Subjects</span>
                  <ul className="list-none">
                    {student.subjects.map((subject, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 before:content-['◈'] before:mr-2 before:text-primary"
                      >
                        <span className="text-gray-700">{subject.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-colors">
          <div className="p-6">
            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
              <span className="mr-2">💰</span> Payment Information
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Monthly Fee"
                value={
                  student.payment.monthlyFee
                    ? `৳${student.payment.monthlyFee}`
                    : "N/A"
                }
              />
              <InfoRow
                label="Admission Fee"
                value={
                  student.payment.admissionFee
                    ? `৳${student.payment.admissionFee}`
                    : "N/A"
                }
              />
              <InfoRow
                label="Form Fee"
                value={
                  student.payment.formFee
                    ? `৳${student.payment.formFee}`
                    : "N/A"
                }
              />
              <InfoRow
                label="Package Fee"
                value={
                  student.payment.packageFee
                    ? `৳${student.payment.packageFee}`
                    : "N/A"
                }
              />
              {student.payment.referrerFee && (
                <InfoRow
                  label="Referrer Fee"
                  value={`৳${student.payment.referrerFee}`}
                />
              )}
              {student.payment.comments && (
                <InfoRow
                  label="Payment Comments"
                  value={student.payment.comments}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent info display
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-gray-700">{value || "N/A"}</span>
  </div>
);

export default StudentDetailsComponent;
