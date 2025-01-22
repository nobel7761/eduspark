"use client";

import { ITeacher, PaymentType } from "@/types/teacher";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { allTeachersList } from "../../../../public/data/teachers";
import Link from "next/link";

const EditTeacherComponent = () => {
  const params = useParams();
  const [teacher, setTeacher] = useState<ITeacher>({
    firstName: "",
    lastName: "",
    teacherId: "",
    photo: "",
    primaryPhone: "",
    secondaryPhone: "",
    paymentType: PaymentType.FIXED,
    nidNumber: "",
    address: "",
    educationalBackground: {
      sscInstitute: "",
      sscPassingYear: "",
      sscGroup: "",
      hscInstitute: "",
      hscPassingYear: "",
      hscGroup: "",
    },
  });

  useEffect(() => {
    const foundTeacher = allTeachersList.find(
      (s) => s.teacherId === params.teacherId
    );
    if (foundTeacher) {
      setTeacher(foundTeacher);
    }
  }, [params.teacherId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Updated teacher data:", teacher);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <Link
          href="/teachers"
          className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          ← Back to Teachers
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Edit Teacher Information</h2>

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
                value={teacher.firstName}
                onChange={(e) =>
                  setTeacher({ ...teacher, firstName: e.target.value })
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
                value={teacher.lastName}
                onChange={(e) =>
                  setTeacher({ ...teacher, lastName: e.target.value })
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
                value={teacher.photo}
                onChange={(e) =>
                  setTeacher({ ...teacher, photo: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Teacher ID
              </label>
              <input
                type="text"
                value={teacher.teacherId}
                onChange={(e) =>
                  setTeacher({ ...teacher, teacherId: e.target.value })
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
                value={teacher.primaryPhone}
                onChange={(e) =>
                  setTeacher({ ...teacher, primaryPhone: e.target.value })
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
                value={teacher.secondaryPhone}
                onChange={(e) =>
                  setTeacher({ ...teacher, secondaryPhone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={teacher.address}
                onChange={(e) =>
                  setTeacher({ ...teacher, address: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Educational Background */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Educational Background
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                SSC Institute
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.sscInstitute}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      sscInstitute: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                SSC Group
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.sscGroup}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      sscGroup: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                SSC Passing Year
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.sscPassingYear}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      sscPassingYear: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                HSC Institute
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.hscInstitute}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      hscInstitute: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                HSC Group
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.hscGroup}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      hscGroup: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                HSC Passing Year
              </label>
              <input
                type="text"
                value={teacher.educationalBackground.hscPassingYear}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    educationalBackground: {
                      ...teacher.educationalBackground,
                      hscPassingYear: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border border-primary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Payment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Type
              </label>
              <select
                value={teacher.paymentType}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    paymentType: e.target.value as PaymentType,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="CLASS_BASED">Class</option>
                <option value="FIXED">Fixed</option>
              </select>
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

export default EditTeacherComponent;
