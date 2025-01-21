"use client";

import { useState, useEffect } from "react";
import { Sex } from "@/types/student";
import Link from "next/link";
import { allStudentsList } from "../../../../public/data/students";
import { useParams } from "next/navigation";
import { IStudent } from "@/types/student";

const EditStudentComponent = () => {
  const params = useParams();
  const [student, setStudent] = useState<IStudent>({
    firstName: "",
    lastName: "",
    class: 0,
    sex: Sex.MALE,
    presentAddress: "",
    permanentAddress: "",
    institute: "",
    primaryPhone: "",
    secondaryPhone: "",
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",
    studentId: "",
    photo: "",
    referredBy: {
      name: "",
      phone: "",
    },
    admissionDate: "",
  });

  useEffect(() => {
    const foundStudent = allStudentsList.find(
      (s) => s.studentId === params.studentId
    );
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [params.studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Updated student data:", student);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <Link
          href="/students"
          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          ← Back to Students
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Edit Student Information</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Personal Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={student.firstName}
                onChange={(e) =>
                  setStudent({ ...student, firstName: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={student.lastName}
                onChange={(e) =>
                  setStudent({ ...student, lastName: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <input
                type="number"
                value={student.class}
                onChange={(e) =>
                  setStudent({ ...student, class: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sex</label>
              <select
                value={student.sex}
                onChange={(e) =>
                  setStudent({ ...student, sex: e.target.value as Sex })
                }
                className="w-full p-2 border rounded"
              >
                <option value={Sex.MALE}>Male</option>
                <option value={Sex.FEMALE}>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Institute
              </label>
              <input
                type="text"
                value={student.institute}
                onChange={(e) =>
                  setStudent({ ...student, institute: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Admission Date
              </label>
              <input
                type="date"
                value={student.admissionDate}
                onChange={(e) =>
                  setStudent({ ...student, admissionDate: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Photo URL
              </label>
              <input
                type="text"
                value={student.photo}
                onChange={(e) =>
                  setStudent({ ...student, photo: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={student.studentId}
                onChange={(e) =>
                  setStudent({ ...student, studentId: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Phone
              </label>
              <input
                type="text"
                value={student.primaryPhone}
                onChange={(e) =>
                  setStudent({ ...student, primaryPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Secondary Phone
              </label>
              <input
                type="text"
                value={student.secondaryPhone}
                onChange={(e) =>
                  setStudent({ ...student, secondaryPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Present Address
              </label>
              <textarea
                value={student.presentAddress}
                onChange={(e) =>
                  setStudent({ ...student, presentAddress: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Permanent Address
              </label>
              <textarea
                value={student.permanentAddress}
                onChange={(e) =>
                  setStudent({ ...student, permanentAddress: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Father's Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Father&apos;s Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Name
              </label>
              <input
                type="text"
                value={student.fatherName}
                onChange={(e) =>
                  setStudent({ ...student, fatherName: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Phone
              </label>
              <input
                type="text"
                value={student.fatherPhone}
                onChange={(e) =>
                  setStudent({ ...student, fatherPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Occupation
              </label>
              <input
                type="text"
                value={student.fatherOccupation}
                onChange={(e) =>
                  setStudent({ ...student, fatherOccupation: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Mother's Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Mother&apos;s Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                value={student.motherName}
                onChange={(e) =>
                  setStudent({ ...student, motherName: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Phone
              </label>
              <input
                type="text"
                value={student.motherPhone}
                onChange={(e) =>
                  setStudent({ ...student, motherPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Occupation
              </label>
              <input
                type="text"
                value={student.motherOccupation}
                onChange={(e) =>
                  setStudent({ ...student, motherOccupation: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Referral Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Referred By Name
              </label>
              <input
                type="text"
                value={student.referredBy.name}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    referredBy: { ...student.referredBy, name: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Referred By Phone
              </label>
              <input
                type="text"
                value={student.referredBy.phone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    referredBy: {
                      ...student.referredBy,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/students"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentComponent;
