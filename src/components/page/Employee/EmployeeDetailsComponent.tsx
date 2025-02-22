"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IEmployee } from "@/types/employee";
import {
  FaUser,
  FaPhone,
  FaDollarSign,
  FaUsers,
  FaGraduationCap,
  FaComment,
} from "react-icons/fa";
import { PaymentMethod } from "@/enums/common.enum";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstCharacter";

const EmployeeDetailsComponent = () => {
  const params = useParams();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employees/${params.employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setEmployee(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.employeeId) {
      fetchEmployee();
    }
  }, [params.employeeId]);

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

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-primary text-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Employee Details</h1>
        <div className="flex gap-4">
          <Link
            href="/employees"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back to Employees
          </Link>
          <Link
            href={`/employees/edit/${employee?.employeeId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Employee
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
                value={`${employee?.firstName} ${employee?.lastName}`}
              />
              <InfoItem label="Gender" value={employee?.gender} />
              <InfoItem label="Employee ID" value={employee?.employeeId} />
              <InfoItem label="NID" value={employee?.nidNumber || "-"} />
              <InfoItem
                label="Employee Type"
                value={capitalizeFirstLetter(employee?.employeeType)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-red-600 p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <FaPhone className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <InfoItem label="Primary Phone" value={employee?.primaryPhone} />
              <InfoItem
                label="Secondary Phone"
                value={employee?.secondaryPhone || "-"}
              />
              <InfoItem label="Email" value={employee?.email || "-"} />
              <InfoItem
                label="Present Address"
                value={employee?.presentAddress}
              />
              <InfoItem
                label="Permanent Address"
                value={employee?.permanentAddress || "-"}
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
                  employee?.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : "-"
                }
              />
              <InfoItem
                label="Payment Method"
                value={employee?.paymentMethod}
              />
              {employee?.paymentMethod === PaymentMethod.PerClass && (
                <InfoItem
                  label="Payment Per Class"
                  value={`${employee?.paymentPerClass} BDT`}
                />
              )}
              {employee?.paymentMethod === PaymentMethod.Monthly && (
                <InfoItem
                  label="Payment Per Month"
                  value={`${employee?.paymentPerMonth} BDT`}
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
                  <InfoItem label="Name" value={employee?.father?.name} />
                  <InfoItem label="Phone" value={employee?.father?.phone} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700 mb-2">
                  Mother&apos;s Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Name" value={employee?.mother?.name} />
                  <InfoItem label="Phone" value={employee?.mother?.phone} />
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
                  value={employee?.educationalBackground?.university?.institute}
                />
                <InfoItem
                  label="Department"
                  value={
                    employee?.educationalBackground?.university?.department
                  }
                />
                {employee?.isCurrentlyStudying ? (
                  <InfoItem
                    label="Admission Year"
                    value={
                      employee?.educationalBackground?.university?.admissionYear
                    }
                  />
                ) : (
                  <>
                    <InfoItem
                      label="Passing Year"
                      value={
                        employee?.educationalBackground?.university?.passingYear
                      }
                    />
                    <InfoItem
                      label="CGPA"
                      value={employee?.educationalBackground?.university?.cgpa}
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
                  value={employee?.educationalBackground?.hsc?.institute}
                />
                <InfoItem
                  label="Group"
                  value={employee?.educationalBackground?.hsc?.group}
                />
                <InfoItem
                  label="Passing Year"
                  value={employee?.educationalBackground?.hsc?.year}
                />
                <InfoItem
                  label="GPA"
                  value={employee?.educationalBackground?.hsc?.result}
                />
              </div>
            </div>

            {/* SSC Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-primary mb-3">SSC Information</h3>
              <div className="space-y-2">
                <InfoItem
                  label="Institute"
                  value={employee?.educationalBackground?.ssc?.institute}
                />
                <InfoItem
                  label="Group"
                  value={employee?.educationalBackground?.ssc?.group}
                />
                <InfoItem
                  label="Passing Year"
                  value={employee?.educationalBackground?.ssc?.year}
                />
                <InfoItem
                  label="GPA"
                  value={employee?.educationalBackground?.ssc?.result}
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
              {employee?.comments || "No comments available"}
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

export default EmployeeDetailsComponent;
