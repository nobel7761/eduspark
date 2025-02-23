"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Gender, Group, PaymentMethod } from "@/enums/common.enum";
import PageLoader from "@/components/shared/PageLoader";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { IEmployee } from "@/types/employee";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./CreateEmployeeComponent";
import * as yup from "yup";
import Select from "react-select";
import { BsFillTrashFill } from "react-icons/bs";
import { classOptions } from "./CreateEmployeeComponent";

// Extend the schema to include employeeId
const extendedSchema = schema.shape({
  employeeId: yup
    .string()
    .required("Employee ID is required")
    .min(2, "Employee ID must be at least 2 characters")
    .max(50, "Employee ID must not exceed 50 characters"),
});

const EditEmployeeComponent = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedHscGroup, setSelectedHscGroup] = useState<Group | null>(null);
  const [selectedSscGroup, setSelectedSscGroup] = useState<Group | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(extendedSchema),
  });

  const {
    fields: paymentPerClassFields,
    append: appendPaymentPerClass,
    remove: removePaymentPerClass,
  } = useFieldArray({
    control,
    name: "paymentPerClass",
  });

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

      // Format the joiningDate to YYYY-MM-DD before setting it
      const formattedData = {
        ...data,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate).toISOString().split("T")[0]
          : "",
      };

      // Reset form with formatted data
      reset(formattedData);

      // Set select fields
      setSelectedPaymentMethod(data.paymentMethod);
      setSelectedHscGroup(data.educationalBackground?.hsc?.group || null);
      setSelectedSscGroup(data.educationalBackground?.ssc?.group || null);
      setSelectedGender(data.gender);
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

  useEffect(() => {
    if (
      selectedPaymentMethod === PaymentMethod.PerClass &&
      paymentPerClassFields.length === 0
    ) {
      appendPaymentPerClass({ classes: [], amount: 0 });
    }
  }, [
    selectedPaymentMethod,
    appendPaymentPerClass,
    paymentPerClassFields.length,
  ]);

  const onSubmit = async (data: IEmployee) => {
    try {
      // Ensure paymentPerClass is an empty array when payment method is Monthly
      const formattedData = {
        ...data,
        paymentPerClass:
          data.paymentMethod === PaymentMethod.Monthly
            ? []
            : data.paymentPerClass,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employees/${params.employeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update employee");
      }

      toast.success("Employee updated successfully!");
      setTimeout(() => {
        router.push("/employees");
      }, 2000);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee"
      );
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

  if (loading) {
    return <PageLoader loading={true} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 rounded-md bg-primary">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Edit Employee Information
        </h1>
        <Link
          href="/employees"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Employees
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("firstName")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Employee ID
              </label>
              <input
                type="text"
                {...register("employeeId")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employeeId.message}
                </p>
              )}
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
                  setValue("gender", value as Gender);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
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
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Primary Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Primary Phone
              </label>
              <input
                type="text"
                {...register("primaryPhone")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.primaryPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.primaryPhone.message}
                </p>
              )}
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Secondary Phone
              </label>
              <input
                type="text"
                {...register("secondaryPhone")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.secondaryPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.secondaryPhone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* NID Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                NID Number
              </label>
              <input
                type="text"
                {...register("nidNumber")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.nidNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nidNumber.message}
                </p>
              )}
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
                {...register("joiningDate")}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              />
              {errors.joiningDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.joiningDate.message}
                </p>
              )}
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
                  setValue("paymentMethod", value as PaymentMethod);

                  // Clear paymentPerClass when switching to Monthly
                  if (value === PaymentMethod.Monthly) {
                    setValue("paymentPerClass", []); // Set empty array instead of undefined
                    setValue("paymentPerMonth", 0); // Initialize monthly payment
                  }
                  // Clear monthlyPayment when switching to PerClass
                  else if (value === PaymentMethod.PerClass) {
                    setValue("paymentPerMonth", undefined);
                    appendPaymentPerClass({ classes: [], amount: 0 });
                  }
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
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
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Conditional Payment Fields */}
            {selectedPaymentMethod === PaymentMethod.PerClass && (
              <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded-lg border border-white relative my-4">
                <div className="absolute -top-3 right-4">
                  <button
                    type="button"
                    onClick={() =>
                      appendPaymentPerClass({ classes: [], amount: 0 })
                    }
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    Add More Class Payment Details
                  </button>
                </div>

                {paymentPerClassFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative border border-gray-700 rounded-lg p-4 text-primary mt-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Class Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">
                          Select Classes
                        </label>
                        <Select
                          isMulti
                          options={classOptions}
                          onChange={(newValue) => {
                            const selectedClasses = newValue.map(
                              (option) => option.value
                            );
                            setValue(
                              `paymentPerClass.${index}.classes`,
                              selectedClasses,
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          }}
                          value={classOptions.filter((option) =>
                            watch(`paymentPerClass.${index}.classes`)?.includes(
                              option.value
                            )
                          )}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              background: "#374151",
                              borderColor: "#4B5563",
                              color: "white",
                            }),
                            menu: (base) => ({
                              ...base,
                              background: "#374151",
                              color: "white",
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isFocused
                                ? "#4B5563"
                                : "#374151",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#4B5563",
                              },
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "#4B5563",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "white",
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#6B7280",
                                color: "white",
                              },
                            }),
                            input: (base) => ({
                              ...base,
                              color: "white",
                            }),
                          }}
                        />
                      </div>

                      {/* Payment Amount */}
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">
                          Payment Per Class
                        </label>
                        <input
                          type="number"
                          {...register(`paymentPerClass.${index}.amount`)}
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Delete button */}
                    {paymentPerClassFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentPerClass(index)}
                        className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                      >
                        <BsFillTrashFill className="text-white text-xl" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedPaymentMethod === PaymentMethod.Monthly && (
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Payment Per Month
                </label>
                <input
                  type="number"
                  {...register("paymentPerMonth")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.paymentPerMonth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentPerMonth.message}
                  </p>
                )}
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
                  {...register("presentAddress")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  rows={3}
                />
                {errors.presentAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.presentAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Permanent Address
                </label>
                <textarea
                  {...register("permanentAddress")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  rows={3}
                />
                {errors.permanentAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.permanentAddress.message}
                  </p>
                )}
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
                      {...register("father.name")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.father && errors.father.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.father.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Phone
                    </label>
                    <input
                      type="text"
                      {...register("father.phone")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.father && errors.father.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.father.phone.message}
                      </p>
                    )}
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
                      {...register("mother.name")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.mother && errors.mother.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mother.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Phone
                    </label>
                    <input
                      type="text"
                      {...register("mother.phone")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.mother && errors.mother.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mother.phone.message}
                      </p>
                    )}
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
                  {...register("isCurrentlyStudying")}
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
                  {...register("educationalBackground.university.institute")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.university &&
                  errors.educationalBackground.university.institute && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.educationalBackground.university.institute
                          .message
                      }
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Department
                </label>
                <input
                  type="text"
                  {...register("educationalBackground.university.department")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.university &&
                  errors.educationalBackground.university.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.educationalBackground.university.department
                          .message
                      }
                    </p>
                  )}
              </div>

              {watch("isCurrentlyStudying") ? (
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Admission Year
                  </label>
                  <input
                    type="number"
                    {...register(
                      "educationalBackground.university.admissionYear"
                    )}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                  {errors.educationalBackground &&
                    errors.educationalBackground.university &&
                    errors.educationalBackground.university.admissionYear && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.educationalBackground.university.admissionYear
                            .message
                        }
                      </p>
                    )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      {...register(
                        "educationalBackground.university.passingYear"
                      )}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.educationalBackground &&
                      errors.educationalBackground.university &&
                      errors.educationalBackground.university.passingYear && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors.educationalBackground.university.passingYear
                              .message
                          }
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("educationalBackground.university.cgpa")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.educationalBackground &&
                      errors.educationalBackground.university &&
                      errors.educationalBackground.university.cgpa && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.educationalBackground.university.cgpa.message}
                        </p>
                      )}
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
                  {...register("educationalBackground.hsc.institute")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.hsc &&
                  errors.educationalBackground.hsc.institute && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.hsc.institute.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Group
                </label>
                <Listbox
                  value={selectedHscGroup}
                  onChange={(value) => {
                    setSelectedHscGroup(value);
                    setValue("educationalBackground.hsc.group", value as Group);
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
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
                {errors.educationalBackground &&
                  errors.educationalBackground.hsc &&
                  errors.educationalBackground.hsc.group && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.hsc.group.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Passing Year
                </label>
                <input
                  type="text"
                  {...register("educationalBackground.hsc.year")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.hsc &&
                  errors.educationalBackground.hsc.year && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.hsc.year.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("educationalBackground.hsc.result")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.hsc &&
                  errors.educationalBackground.hsc.result && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.hsc.result.message}
                    </p>
                  )}
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
                  {...register("educationalBackground.ssc.institute")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.ssc &&
                  errors.educationalBackground.ssc.institute && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.ssc.institute.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Group
                </label>
                <Listbox
                  value={selectedSscGroup}
                  onChange={(value) => {
                    setSelectedSscGroup(value);
                    setValue("educationalBackground.ssc.group", value as Group);
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
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
                {errors.educationalBackground &&
                  errors.educationalBackground.ssc &&
                  errors.educationalBackground.ssc.group && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.ssc.group.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Passing Year
                </label>
                <input
                  type="text"
                  {...register("educationalBackground.ssc.year")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.ssc &&
                  errors.educationalBackground.ssc.year && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.ssc.year.message}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("educationalBackground.ssc.result")}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
                {errors.educationalBackground &&
                  errors.educationalBackground.ssc &&
                  errors.educationalBackground.ssc.result && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationalBackground.ssc.result.message}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
          <div>
            <textarea
              {...register("comments")}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
              rows={3}
              placeholder="Add any additional comments..."
            />
            {errors.comments && (
              <p className="text-red-500 text-xs mt-1">
                {errors.comments.message}
              </p>
            )}
          </div>
        </div>

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

export default EditEmployeeComponent;
