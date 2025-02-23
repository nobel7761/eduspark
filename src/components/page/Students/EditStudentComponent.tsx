"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IUpdateStudent, Religion } from "@/types/student";
import PageLoader from "@/components/shared/PageLoader";
import { useForm, SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// import {
//   personalInfoSchema,
//   educationAndAddressInfoSchema,
//   parentsInfoSchema,
//   referralAndPaymentInfoSchema,
// } from "@/components/UI/StepperForm/Form Schemas/CreateStudentFormSchema";
import Select from "react-select";
import { MultiValue } from "react-select";
import { subjectOptions } from "./steps/EducationInfo";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { Gender, Group } from "@/enums/common.enum";

// Combine all schemas
// const editStudentSchema = yup.object().shape({
//   ...personalInfoSchema.fields,
//   ...educationAndAddressInfoSchema.fields,
//   ...parentsInfoSchema.fields,
//   ...referralAndPaymentInfoSchema.fields,
// });

const EditStudentComponent = () => {
  const params = useParams();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<IUpdateStudent>({
    // resolver: yupResolver(editStudentSchema),
  });

  const [selectedGender, setSelectedGender] = useState(watch("gender") || "");
  const [selectedReligion, setSelectedReligion] = useState(
    watch("religion") || ""
  );
  const [selectedClass, setSelectedClass] = useState(watch("class") || "");
  const [selectedGroup, setSelectedGroup] = useState<Group | "">(
    watch("group") as Group
  );

  const fetchStudent = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/students/${params.studentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      const data = await response.json();
      // Format the date of birth to YYYY-MM-DD format for the date input
      if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth)
          .toISOString()
          .split("T")[0];
      }
      if (data.admissionDate) {
        data.admissionDate = new Date(data.admissionDate)
          .toISOString()
          .split("T")[0];
      }
      reset(data);

      // Set default values for select fields
      setSelectedGender(data.gender || "");
      setSelectedReligion(data.religion || "");
      setSelectedClass(data.class || "");
      setSelectedGroup(data.group || "");
    } catch (err) {
      setError(err as Error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (params.studentId) {
      fetchStudent();
    }
  }, [params.studentId]);

  const onSubmit: SubmitHandler<IUpdateStudent> = async (data) => {
    try {
      // Clear group and subjects based on class selection
      if (
        [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "spoken_english",
          "arabic",
          "drawing",
        ].includes(data?.class || "")
      ) {
        data.group = "";
        data.subjects = [];
      } else if (["9", "10"].includes(data?.class || "")) {
        data.subjects = [];
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/students/${params.studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update student");
      }

      toast.success("Student updated successfully", {
        onClose: () => router.push("/students"),
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update student"
      );
    }
  };

  if (initialLoading) {
    return <PageLoader loading={true} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-primary min-h-screen rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Edit Student Information
        </h2>
        <Link
          href="/students"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Students
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl shadow-sm p-6 border border-white"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Admission Date
              </label>
              <input
                type="date"
                {...register("admissionDate")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.admissionDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.admissionDate.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Gender
              </label>
              <Listbox
                value={selectedGender}
                onChange={(value) => {
                  setSelectedGender(value);
                  setValue("gender", value as Gender, {
                    shouldValidate: true,
                  });
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                    <span className="block truncate">
                      {(selectedGender || "Select Gender") as string}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                    {["Male", "Female"].map((gender) => (
                      <Listbox.Option
                        key={gender}
                        value={gender}
                        className={({ active }) =>
                          `${
                            active ? "bg-primary text-white" : "text-white"
                          } cursor-pointer select-none relative py-2 pl-10 pr-4`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {gender}
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
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Religion
              </label>
              <Listbox
                value={selectedReligion}
                onChange={(value) => {
                  setSelectedReligion(value);
                  setValue("religion", value as Religion, {
                    shouldValidate: true,
                  });
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                    <span className="block truncate">
                      {(selectedReligion || "Select Religion") as string}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                    {["Islam", "Hinduism", "Christianity", "Buddhism"].map(
                      (religion) => (
                        <Listbox.Option
                          key={religion}
                          value={religion}
                          className={({ active }) =>
                            `${
                              active ? "bg-primary text-white" : "text-white"
                            } cursor-pointer select-none relative py-2 pl-10 pr-4`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {religion}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <FaCheckCircle className="w-5 h-5" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      )
                    )}
                  </Listbox.Options>
                </div>
              </Listbox>
              {errors.religion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.religion.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Education & Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl shadow-sm p-6 border border-white"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Education & Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Institute Name
              </label>
              <input
                type="text"
                {...register("instituteName")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.instituteName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.instituteName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Class
                </label>
                <Listbox
                  value={selectedClass}
                  onChange={(value) => {
                    setSelectedClass(value);
                    setValue("class", value, { shouldValidate: true });
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                      <span className="block truncate">
                        {selectedClass
                          ? `Class ${selectedClass}`
                          : "Select Class"}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                      {[
                        ...Array.from({ length: 10 }, (_, i) =>
                          (i + 3).toString()
                        ),
                        "arabic",
                        "drawing",
                        "spoken_english",
                      ].map((classOption) => (
                        <Listbox.Option
                          key={classOption}
                          value={classOption}
                          className={({ active }) =>
                            `${
                              active ? "bg-primary text-white" : "text-white"
                            } cursor-pointer select-none relative py-2 pl-10 pr-4`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {isNaN(Number(classOption))
                                  ? classOption.charAt(0).toUpperCase() +
                                    classOption.slice(1)
                                  : `Class ${classOption}`}
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
                {errors.class && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.class.message}
                  </p>
                )}
              </div>

              {/* Group field - Conditional rendering */}
              {watch("class") &&
                ["9", "10", "11", "12"].includes(watch("class") as string) && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Group
                    </label>
                    <Listbox
                      value={selectedGroup}
                      onChange={(value) => {
                        setSelectedGroup(value as Group);
                        setValue("group", value as Group, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                          <span className="block truncate">
                            {selectedGroup ? selectedGroup : "Select Group"}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                          {Object.values(Group).map((group, index) => (
                            <Listbox.Option
                              key={index}
                              value={group}
                              className={({ active }) =>
                                `${
                                  active
                                    ? "bg-primary text-white"
                                    : "text-white"
                                } cursor-pointer select-none relative py-2 pl-10 pr-4`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`${
                                      selected ? "font-medium" : "font-normal"
                                    } block truncate`}
                                  >
                                    {group as string}
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
                    {errors.group && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.group.message}
                      </p>
                    )}
                  </div>
                )}
            </div>

            {/* Subjects field - Conditional rendering */}
            {watch("class") &&
              ["11", "12"].includes(watch("class") as string) && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-white">
                    Subjects
                  </label>
                  <Select
                    isMulti
                    options={subjectOptions}
                    value={watch("subjects")}
                    onChange={(newValue) => {
                      const typedValue = newValue as MultiValue<{
                        value: string;
                        label: string;
                      }>;
                      setValue(
                        "subjects",
                        typedValue as {
                          value: string;
                          label: string;
                        }[],
                        {
                          shouldValidate: true,
                        }
                      );
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#1f2937",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#374151"
                          : "#1f2937",
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "white",
                      }),
                    }}
                  />
                  {errors.subjects && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subjects.message}
                    </p>
                  )}
                </div>
              )}

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-white">
                Present Address
              </label>
              <textarea
                {...register("presentAddress")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
                rows={3}
              />
              {errors.presentAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.presentAddress.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-white">
                Permanent Address
              </label>
              <textarea
                {...register("permanentAddress")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Parents Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl shadow-sm p-6 border border-white"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Parents Information
          </h3>

          {/* Father's Information */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Father&apos;s Name
              </label>
              <input
                type="text"
                {...register("father.name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.father?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.father.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Father&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("father.phone")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.father?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.father.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Father&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("father.occupation")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Mother's Information */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                {...register("mother.name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.mother?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mother.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Mother&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("mother.phone")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.mother?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mother.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Mother&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("mother.occupation")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Payments Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl shadow-sm p-6 border border-white"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Payments Information
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Monthly Fee
              </label>
              <input
                type="number"
                {...register("payment.monthlyFee")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.payment?.monthlyFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment.monthlyFee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Admission Fee
              </label>
              <input
                type="number"
                {...register("payment.admissionFee")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.payment?.admissionFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment.admissionFee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Form Fee
              </label>
              <input
                type="number"
                {...register("payment.formFee")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.payment?.formFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment.formFee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Package Fee
              </label>
              <input
                type="number"
                {...register("payment.packageFee")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.payment?.packageFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment.packageFee.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Referrer Fee
              </label>
              <input
                type="number"
                {...register("payment.referrerFee")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.payment?.referrerFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment.referrerFee.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1 text-white">
              Comments
            </label>
            <textarea
              {...register("payment.comments")}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              rows={3}
            />
            {errors.payment?.comments && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.comments.message}
              </p>
            )}
          </div>
        </motion.div>

        {/* Referral Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl shadow-sm p-6 border border-white"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Referral Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Referrer Name
              </label>
              <input
                type="text"
                {...register("referredBy.name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.referredBy?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.referredBy.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Referrer Phone
              </label>
              <input
                type="tel"
                {...register("referredBy.phone")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none text-white"
              />
              {errors.referredBy?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.referredBy.phone.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/employees"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentComponent;
