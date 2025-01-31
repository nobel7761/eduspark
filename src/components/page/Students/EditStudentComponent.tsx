"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Gender, IStudent } from "@/types/student";
import PageLoader from "@/components/shared/PageLoader";

const EditStudentComponent = () => {
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
      setStudent(data.data);
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
    return <PageLoader loading={true} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

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
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={student?.name}
                onChange={(e) =>
                  setStudent({ ...student, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <input
                type="number"
                value={student?.class}
                onChange={(e) =>
                  setStudent({ ...student, class: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={student?.gender}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    gender: e.target.value as Gender,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Institute
              </label>
              <input
                type="text"
                value={student?.instituteName}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    instituteName: e.target.value,
                  })
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
                value={student?.createdAt}
                onChange={(e) =>
                  setStudent({ ...student, createdAt: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            {/* <div>
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
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={student?.studentId}
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
                value={student?.primaryPhone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    primaryPhone: e.target.value,
                  })
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
                value={student?.secondaryPhone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    secondaryPhone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Present Address
              </label>
              <textarea
                value={student?.presentAddress}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    presentAddress: e.target.value,
                  })
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
                value={student?.permanentAddress}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    permanentAddress: e.target.value,
                  })
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
                value={student?.father.name}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    father: { ...student.father, name: e.target.value },
                  })
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
                value={student?.father.phone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    father: { ...student.father, phone: e.target.value },
                  })
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
                value={student?.father.occupation}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    father: {
                      ...student.father,
                      occupation: e.target.value,
                    },
                  })
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
                value={student?.mother.name}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    mother: { ...student.mother, name: e.target.value },
                  })
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
                value={student?.mother.phone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    mother: { ...student.mother, phone: e.target.value },
                  })
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
                value={student?.mother.occupation}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    mother: {
                      ...student.mother,
                      occupation: e.target.value,
                    },
                  })
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
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                Referred By Name
              </label>
              <input
                type="text"
                value={student?.referredBy?.name}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    referredBy: {
                      ...student?.referredBy,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                Referred By Phone
              </label>
              <input
                type="text"
                value={student?.referredBy?.phone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    referredBy: {
                      ...student?.referredBy,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div> */}
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
