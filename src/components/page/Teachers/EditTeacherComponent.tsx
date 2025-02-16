"use client";

import { ITeacher } from "@/types/teacher";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PaymentMethod } from "@/enums/teachers.enum";
import { Gender, Group } from "@/enums/common.enum";
import PageLoader from "@/components/shared/PageLoader";
import SuccessPopup from "@/components/UI/SuccessPopup";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";

const EditTeacherComponent = () => {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedHscGroup, setSelectedHscGroup] = useState<Group | null>(null);
  const [selectedSscGroup, setSelectedSscGroup] = useState<Group | null>(null);

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

  useEffect(() => {
    if (teacher) {
      setSelectedPaymentMethod(teacher.paymentMethod as PaymentMethod);
      setSelectedHscGroup(teacher.educationalBackground?.hsc?.group || null);
      setSelectedSscGroup(teacher.educationalBackground?.ssc?.group || null);
    }
  }, [teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/teachers/${params.teacherId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teacher),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      setSuccessPopup(true);
      setTimeout(() => {
        router.push("/employees/teachers");
      }, 2000);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const getDisplayText = (value: string | null, prefix?: string) => {
    if (!value) return "Select";
    return prefix
      ? `${prefix} ${capitalizeFirstLetter(value)}`
      : capitalizeFirstLetter(value);
  };

  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  useEffect(() => {
    if (teacher) {
      setSelectedGender(teacher.gender);
    }
  }, [teacher]);

  if (loading) {
    return <PageLoader loading={true} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="container mx-auto p-4 rounded-md bg-primary">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Edit Employee Information
        </h1>
        <Link
          href="/employees/employees"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Employees
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                First Name
              </label>
              <input
                type="text"
                value={teacher?.firstName}
                onChange={(e) =>
                  setTeacher({ ...teacher, firstName: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Last Name
              </label>
              <input
                type="text"
                value={teacher?.lastName}
                onChange={(e) =>
                  setTeacher({ ...teacher, lastName: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Teacher ID */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Teacher ID
              </label>
              <input
                type="text"
                value={teacher?.teacherId}
                onChange={(e) =>
                  setTeacher({ ...teacher, teacherId: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Gender
              </label>
              <Listbox
                value={selectedGender}
                onChange={(value) => {
                  setSelectedGender(value);
                  setTeacher({ ...teacher, gender: value as Gender });
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                    <span className="block truncate">
                      {getDisplayText(selectedGender)}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                    {Object.values(Gender).map((gender) => (
                      <Listbox.Option
                        key={gender}
                        value={gender}
                        className={({ active }) =>
                          `${active ? "bg-primary text-white" : "text-white"}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {capitalizeFirstLetter(gender)}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <FaCheckCircle className="w-5 h-5" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Primary Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Primary Phone
              </label>
              <input
                type="text"
                value={teacher?.primaryPhone}
                onChange={(e) =>
                  setTeacher({ ...teacher, primaryPhone: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Secondary Phone
              </label>
              <input
                type="text"
                value={teacher?.secondaryPhone}
                onChange={(e) =>
                  setTeacher({ ...teacher, secondaryPhone: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <input
                type="email"
                value={teacher?.email || ""}
                onChange={(e) =>
                  setTeacher({ ...teacher, email: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* NID Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                NID Number
              </label>
              <input
                type="text"
                value={teacher?.nidNumber || ""}
                onChange={(e) =>
                  setTeacher({ ...teacher, nidNumber: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Joining Date
              </label>
              <input
                type="date"
                value={
                  teacher?.joiningDate
                    ? new Date(teacher.joiningDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : new Date();
                  setTeacher({ ...teacher, joiningDate: date });
                }}
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Payment Method
              </label>
              <Listbox
                value={selectedPaymentMethod}
                onChange={(value) => {
                  setSelectedPaymentMethod(value);
                  setTeacher({
                    ...teacher,
                    paymentMethod: value as PaymentMethod,
                  });
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                    <span className="block truncate">
                      {getDisplayText(selectedPaymentMethod, "Payment")}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                    {Object.values(PaymentMethod).map((method) => (
                      <Listbox.Option
                        key={method}
                        value={method}
                        className={({ active }) =>
                          `${active ? "bg-primary text-white" : "text-white"}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {capitalizeFirstLetter(method)}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <FaCheckCircle className="w-5 h-5" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Conditional Payment Fields */}
            {selectedPaymentMethod === PaymentMethod.PerClass && (
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Payment Per Class
                </label>
                <input
                  type="number"
                  value={teacher?.paymentPerClass || ""}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      paymentPerClass: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {selectedPaymentMethod === PaymentMethod.Monthly && (
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Payment Per Month
                </label>
                <input
                  type="number"
                  value={teacher?.paymentPerMonth || ""}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      paymentPerMonth: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Address & Parents Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Information */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Address Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Present Address
                </label>
                <textarea
                  value={teacher?.presentAddress || ""}
                  onChange={(e) =>
                    setTeacher({ ...teacher, presentAddress: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Permanent Address
                </label>
                <textarea
                  value={teacher?.permanentAddress || ""}
                  onChange={(e) =>
                    setTeacher({ ...teacher, permanentAddress: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Parents Information */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Parents Information
            </h2>
            <div className="space-y-4">
              {/* Father's Information */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">
                  Father&apos;s Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      value={teacher?.father?.name || ""}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          father: { ...teacher?.father, name: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={teacher?.father?.phone || ""}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          father: { ...teacher?.father, phone: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Mother's Information */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">
                  Mother&apos;s Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      value={teacher?.mother?.name || ""}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          mother: { ...teacher?.mother, name: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={teacher?.mother?.phone || ""}
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          mother: { ...teacher?.mother, phone: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Background */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Educational Background
          </h2>

          {/* University Information */}
          <div className="border border-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">
                University Information
              </h3>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={teacher?.isCurrentlyStudying || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setTeacher({ ...teacher, isCurrentlyStudying: isChecked });
                  }}
                  className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
                />
                <span>Currently Studying</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Institute
                </label>
                <input
                  type="text"
                  value={
                    teacher?.educationalBackground?.university?.institute || ""
                  }
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        university: {
                          ...teacher?.educationalBackground?.university,
                          institute: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Department
                </label>
                <input
                  type="text"
                  value={
                    teacher?.educationalBackground?.university?.department || ""
                  }
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        university: {
                          ...teacher?.educationalBackground?.university,
                          department: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {teacher?.isCurrentlyStudying ? (
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Admission Year
                  </label>
                  <input
                    type="number"
                    value={
                      teacher?.educationalBackground?.university
                        ?.admissionYear || ""
                    }
                    onChange={(e) =>
                      setTeacher({
                        ...teacher,
                        educationalBackground: {
                          ...teacher?.educationalBackground,
                          university: {
                            ...teacher?.educationalBackground?.university,
                            admissionYear: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={
                        teacher?.educationalBackground?.university
                          ?.passingYear || ""
                      }
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          educationalBackground: {
                            ...teacher?.educationalBackground,
                            university: {
                              ...teacher?.educationalBackground?.university,
                              passingYear: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={
                        teacher?.educationalBackground?.university?.cgpa || ""
                      }
                      onChange={(e) =>
                        setTeacher({
                          ...teacher,
                          educationalBackground: {
                            ...teacher?.educationalBackground,
                            university: {
                              ...teacher?.educationalBackground?.university,
                              cgpa: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* HSC Information */}
          <div className="flex-1 border border-white rounded-lg p-4 my-6">
            <h3 className="text-lg font-semibold mb-3 text-white">
              HSC Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={teacher?.educationalBackground?.hsc.institute}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        hsc: {
                          ...teacher?.educationalBackground?.hsc,
                          institute: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Group
                </label>
                <Listbox
                  value={selectedHscGroup}
                  onChange={(value) => {
                    setSelectedHscGroup(value);
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        hsc: {
                          ...teacher?.educationalBackground?.hsc,
                          group: value as Group,
                        },
                      },
                    });
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                      <span className="block truncate">
                        {getDisplayText(selectedHscGroup)}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                      {Object.values(Group).map((group) => (
                        <Listbox.Option
                          key={group}
                          value={group}
                          className={({ active }) =>
                            `${active ? "bg-primary text-white" : "text-white"}
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {capitalizeFirstLetter(group)}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <FaCheckCircle className="w-5 h-5" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Passing Year
                </label>
                <input
                  type="text"
                  value={teacher?.educationalBackground?.hsc.year}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        hsc: {
                          ...teacher?.educationalBackground?.hsc,
                          year: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={teacher?.educationalBackground?.hsc?.result || ""}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        hsc: {
                          ...teacher?.educationalBackground?.hsc,
                          result: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* SSC Information */}
          <div className="flex-1 border border-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-white">
              SSC Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={teacher?.educationalBackground?.ssc.institute}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        ssc: {
                          ...teacher?.educationalBackground?.ssc,
                          institute: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Group
                </label>
                <Listbox
                  value={selectedSscGroup}
                  onChange={(value) => {
                    setSelectedSscGroup(value);
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        ssc: {
                          ...teacher?.educationalBackground?.ssc,
                          group: value as Group,
                        },
                      },
                    });
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                      <span className="block truncate">
                        {getDisplayText(selectedSscGroup)}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                      {Object.values(Group).map((group) => (
                        <Listbox.Option
                          key={group}
                          value={group}
                          className={({ active }) =>
                            `${active ? "bg-primary text-white" : "text-white"}
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {capitalizeFirstLetter(group)}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <FaCheckCircle className="w-5 h-5" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Passing Year
                </label>
                <input
                  type="text"
                  value={teacher?.educationalBackground?.ssc.year}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        ssc: {
                          ...teacher?.educationalBackground?.ssc,
                          year: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={teacher?.educationalBackground?.ssc?.result || ""}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      educationalBackground: {
                        ...teacher?.educationalBackground,
                        ssc: {
                          ...teacher?.educationalBackground?.ssc,
                          result: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
          <div>
            <textarea
              value={teacher?.comments || ""}
              onChange={(e) =>
                setTeacher({ ...teacher, comments: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Add any additional comments..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/employees/teachers"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>

      <SuccessPopup
        isOpen={successPopup}
        onClose={() => setSuccessPopup(false)}
        message="Teacher updated successfully!"
      />
    </div>
  );
};

export default EditTeacherComponent;
