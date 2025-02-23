"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Gender, PaymentMethod } from "@/enums/common.enum";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SuccessPopup from "@/components/UI/SuccessPopup";
import FailedPopup from "@/components/UI/FailedPopup";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { Group } from "@/enums/common.enum";
import { FaCheckCircle } from "react-icons/fa";
import { IEmployeeWithoutId } from "@/types/employee";
import { EmployeeType } from "@/enums/employees.enum";
import Select from "react-select";
import { useFieldArray } from "react-hook-form";
import { BsFillTrashFill } from "react-icons/bs";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstCharacter";

export const classOptions = [
  { value: "3", label: "Class 3" },
  { value: "4", label: "Class 4" },
  { value: "5", label: "Class 5" },
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
  { value: "arabic", label: "Arabic" },
  { value: "spoken_english", label: "Spoken English" },
  { value: "drawing", label: "Drawing" },
];

// Form schema matches IE interface but excludes auto-generated fields
export const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  joiningDate: yup
    .date()
    .required("Joining date is required")
    .max(new Date(), "Joining date cannot be in the future"),
  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender))
    .required("Gender is required"),
  primaryPhone: yup
    .string()
    .required("Primary phone is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  secondaryPhone: yup.string().optional(),
  email: yup.string().optional(),
  nidNumber: yup.string().optional(),
  presentAddress: yup
    .string()
    .required("Present address is required")
    .min(10, "Present address must be at least 10 characters")
    .max(100, "Present address must not exceed 100 characters"),
  permanentAddress: yup.string().optional(),
  father: yup.object({
    name: yup
      .string()
      .required("Father's name is required")
      .min(3, "Father's name must be at least 3 characters")
      .max(50, "Father's name must not exceed 50 characters"),
    phone: yup
      .string()
      .required("Father's phone is required")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),
  mother: yup.object({
    name: yup
      .string()
      .required("Mother's name is required")
      .min(3, "Mother's name must be at least 3 characters")
      .max(50, "Mother's name must not exceed 50 characters"),
    phone: yup
      .string()
      .required("Mother's phone is required")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),
  paymentMethod: yup
    .mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod))
    .required("Payment method is required"),
  paymentPerClass: yup.array().when("paymentMethod", {
    is: PaymentMethod.PerClass,
    then: () =>
      yup
        .array()
        .of(
          yup.object({
            classes: yup
              .array()
              .of(yup.string())
              .min(1, "At least one class must be selected")
              .required("Classes are required"),
            amount: yup
              .number()
              .transform((value) => (isNaN(value) ? undefined : value))
              .typeError("Payment amount must be a number")
              .required("Payment amount is required")
              .min(0, "Payment cannot be negative"),
          })
        )
        .required("At least one class payment detail is required"),
    otherwise: () => yup.array().nullable(),
  }),
  paymentPerMonth: yup.number().when("paymentMethod", {
    is: PaymentMethod.Monthly,
    then: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError("Payment per month must be a number")
        .required("Payment per month is required")
        .min(0, "Payment cannot be negative"),
  }),
  isCurrentlyStudying: yup.boolean().default(false),
  educationalBackground: yup.object({
    university: yup.object({
      institute: yup
        .string()
        .required("Institute is required")
        .min(3, "Institute must be at least 3 characters")
        .max(50, "Institute must not exceed 50 characters"),
      department: yup
        .string()
        .required("Department is required")
        .min(3, "Department must be at least 3 characters")
        .max(50, "Department must not exceed 50 characters"),
      admissionYear: yup
        .number()
        .nullable()
        .when("isCurrentlyStudying", {
          is: true,
          then: (schema) =>
            schema
              .required("Admission year is required")
              .min(1971, "Year must be after 1971")
              .max(new Date().getFullYear(), "Year cannot be in the future"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      passingYear: yup
        .number()
        .nullable()
        .when("isCurrentlyStudying", {
          is: false,
          then: (schema) =>
            schema
              .required("Passing year is required")
              .min(1971, "Year must be after 1971")
              .max(new Date().getFullYear(), "Year cannot be in the future"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      cgpa: yup
        .number()
        .nullable()
        .when("isCurrentlyStudying", {
          is: false,
          then: (schema) =>
            schema
              .required("CGPA is required")
              .min(0, "CGPA must be greater than 0")
              .max(4, "CGPA must be less than or equal to 4")
              .test(
                "decimal",
                "CGPA can have maximum 2 decimal places",
                (value) => {
                  if (!value) return true;
                  return /^\d*\.?\d{0,2}$/.test(value.toString());
                }
              ),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
    }),
    ssc: yup
      .object({
        year: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("SSC year is required")
          .min(1971, "Year must be after 1971")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
        group: yup
          .mixed<Group>()
          .oneOf(Object.values(Group))
          .required("SSC group is required")
          .nullable(),
        result: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("SSC result is required")
          .min(1, "Result must be between 1 and 5")
          .max(5, "Result must be between 1 and 5")
          .test(
            "decimal",
            "Result can have maximum 2 decimal places",
            (value) => {
              if (!value) return true;
              return /^\d*\.?\d{0,2}$/.test(value.toString());
            }
          ),
        institute: yup
          .string()
          .required("SSC institute is required")
          .min(3, "Institute must be at least 3 characters")
          .max(50, "Institute must not exceed 50 characters"),
      })
      .required(),
    hsc: yup
      .object({
        year: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("HSC year is required")
          .min(1971, "Year must be after 1971")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
        group: yup
          .mixed<Group>()
          .oneOf(Object.values(Group))
          .required("HSC group is required")
          .nullable(),
        result: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("HSC result is required")
          .min(1, "Result must be between 1 and 5")
          .max(5, "Result must be between 1 and 5")
          .test(
            "decimal",
            "Result can have maximum 2 decimal places",
            (value) => {
              if (!value) return true;
              return /^\d*\.?\d{0,2}$/.test(value.toString());
            }
          ),
        institute: yup
          .string()
          .required("HSC institute is required")
          .min(3, "Institute must be at least 3 characters")
          .max(50, "Institute must not exceed 50 characters"),
      })
      .required(),
  }),
  comments: yup.string().optional(),
  employeeType: yup
    .mixed<EmployeeType>()
    .oneOf(Object.values(EmployeeType))
    .required("Employee type is required"),
});

const CreateEmployeeComponent = () => {
  const router = useRouter();
  const [successPopup, setSuccessPopup] = useState(false);
  const [failedPopup, setFailedPopup] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedHscGroup, setSelectedHscGroup] = useState<Group | null>(null);
  const [selectedSscGroup, setSelectedSscGroup] = useState<Group | null>(null);
  const [joiningDate, setJoiningDate] = useState<Date | null>(null);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Failed to create employee. Please try again."
  );
  const [selectedEmployeeType, setSelectedEmployeeType] =
    useState<EmployeeType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isCurrentlyStudying: false,
      paymentPerClass: [],
    },
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control,
    name: "paymentPerClass",
  });

  const handleIsCurrentlyStudyingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;
    setIsCurrentlyStudying(isChecked);
    setValue("isCurrentlyStudying", isChecked, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Reset fields based on the checkbox state
    if (isChecked) {
      setValue("educationalBackground.university.passingYear", null);
      setValue("educationalBackground.university.cgpa", null);
    } else {
      setValue("educationalBackground.university.admissionYear", null);
    }
  };

  // Add this useEffect to initialize the first payment field when Per Class is selected
  useEffect(() => {
    if (
      selectedPaymentMethod === PaymentMethod.PerClass &&
      paymentFields.length === 0
    ) {
      appendPayment({ classes: [], amount: 0 });
    }
  }, [selectedPaymentMethod, appendPayment, paymentFields.length]);

  const onSubmit = async (data: Partial<IEmployeeWithoutId>) => {
    if (data.paymentMethod === PaymentMethod.PerClass) {
      // Ensure amounts are numbers
      data.paymentPerClass = data.paymentPerClass?.map((detail) => ({
        classes: detail.classes,
        amount: Number(detail.amount),
      }));
    } else if (data.paymentMethod === PaymentMethod.Monthly) {
      data.paymentPerMonth = Number(data.paymentPerMonth);
      // Remove the per-class details as they're not needed
      delete data.paymentPerClass;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await response.json();

      setSuccessPopup(true);
      setTimeout(() => {
        router.push("/employees");
      }, 2000);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          setError(err.path as keyof IEmployeeWithoutId, {
            type: "manual",
            message: err.message,
          });
        });
      }
      console.error("Error creating employee:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create employee. Please try again."
      );
      setFailedPopup(true);
    }
  };

  // Modify the display text helper function
  const getDisplayText = (value: string | null, prefix?: string) => {
    if (!value) return "Select";
    return prefix
      ? `${prefix} ${capitalizeFirstLetter(value)}`
      : capitalizeFirstLetter(value);
  };

  return (
    <div className="mx-auto p-4 rounded-md bg-primary">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Create New Employee</h1>
        <Link
          href="/employees"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Employees
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee Type */}
        <div className="bg-gray-800 p-6 rounded-lg flex-grow">
          <label className="block text-sm font-medium mb-1 text-white">
            Employee Type
          </label>
          <Listbox
            value={selectedEmployeeType}
            onChange={(value) => {
              setSelectedEmployeeType(value);
              setValue("employeeType", value as EmployeeType);
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
                <span className="block truncate">
                  {getDisplayText(selectedEmployeeType)}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                {Object.values(EmployeeType).map((type) => (
                  <Listbox.Option
                    key={type}
                    value={type}
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
                          {capitalizeFirstLetter(type)}
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
          {errors.employeeType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employeeType.message as string}
            </p>
          )}
        </div>
        {selectedEmployeeType && (
          <>
            {/* Photo Upload and Personal Information Section */}
            <div className="flex items-center">
              {/* Photo Upload Section */}
              <div className="flex-shrink-0">
                {/* <div className="w-[250px] h-[250px] relative">
              <div className="w-full h-full flex justify-center items-center overflow-hidden bg-gray-600 rounded-full">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <svg
                    className="w-[260px] h-[260px] text-gray-400 mt-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  className="hidden"
                />
                <MdCloudUpload className="text-3xl text-primary hover:text-white transition-colors" />
              </label>
            </div> */}
              </div>

              {/* Personal Information */}
              <div className="bg-gray-800 p-6 rounded-lg flex-grow">
                <h2 className="text-xl font-bold mb-4 text-white">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/*First Name */}
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
                        {errors.firstName.message as string}
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
                        {errors.lastName.message as string}
                      </p>
                    )}
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      onChange={(e) => {
                        const selectedDate = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        setJoiningDate(selectedDate);
                        if (selectedDate) setValue("joiningDate", selectedDate);
                      }}
                      value={
                        joiningDate
                          ? joiningDate.toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                      required
                    />
                    {errors.joiningDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.joiningDate.message as string}
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
                                `${
                                  active
                                    ? "bg-primary text-white"
                                    : "text-white"
                                }
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
                      type="tel"
                      {...register("primaryPhone")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                    {errors.primaryPhone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.primaryPhone.message as string}
                      </p>
                    )}
                  </div>

                  {/* Secondary Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Secondary Phone
                    </label>
                    <input
                      type="tel"
                      {...register("secondaryPhone")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  {selectedEmployeeType === EmployeeType.TEACHER && (
                    <>
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
                            {errors.email.message as string}
                          </p>
                        )}
                      </div>
                    </>
                  )}

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
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">
                Payment Information
              </h2>

              {selectedEmployeeType === EmployeeType.TEACHER && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">
                        Payment Method
                      </label>
                      <Listbox
                        value={selectedPaymentMethod}
                        onChange={(value) => {
                          setSelectedPaymentMethod(value);
                          setValue("paymentMethod", value as PaymentMethod);
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
                                  `${
                                    active
                                      ? "bg-primary text-white"
                                      : "text-white"
                                  }
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
                          {errors.paymentMethod.message as string}
                        </p>
                      )}
                    </div>

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
                            {errors.paymentPerMonth.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedEmployeeType === EmployeeType.TEACHER &&
                selectedPaymentMethod === PaymentMethod.PerClass && (
                  <div className="bg-gray-800 p-6 rounded-lg border border-white relative my-4">
                    <div className="absolute -top-3 right-4">
                      <button
                        type="button"
                        onClick={() =>
                          appendPayment({ classes: [], amount: 0 })
                        }
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                      >
                        Add More Class Payment Details
                      </button>
                    </div>

                    {paymentFields.map((field, index) => (
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
                                watch(
                                  `paymentPerClass.${index}.classes`
                                )?.includes(option.value)
                              )}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  background: "#1f2937",
                                  borderColor: "#374151",
                                  color: "white",
                                }),
                                menu: (base) => ({
                                  ...base,
                                  background: "#1f2937",
                                  color: "white",
                                }),
                                option: (base, state) => ({
                                  ...base,
                                  backgroundColor: state.isFocused
                                    ? "#374151"
                                    : "#1f2937",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#374151",
                                  },
                                }),
                                multiValue: (base) => ({
                                  ...base,
                                  backgroundColor: "#374151",
                                }),
                                multiValueLabel: (base) => ({
                                  ...base,
                                  color: "white",
                                }),
                                multiValueRemove: (base) => ({
                                  ...base,
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#4b5563",
                                    color: "white",
                                  },
                                }),
                                input: (base) => ({
                                  ...base,
                                  color: "white",
                                }),
                              }}
                            />
                            {errors.paymentPerClass &&
                              errors.paymentPerClass[index]?.message && (
                                <p className="text-red-500 text-xs mt-1">
                                  {
                                    errors.paymentPerClass[index]
                                      ?.message as string
                                  }
                                </p>
                              )}
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

                        {/* Only show delete button if there's more than one payment field */}
                        {paymentFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePayment(index)}
                            className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                          >
                            <BsFillTrashFill className="text-white text-xl" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {selectedEmployeeType === EmployeeType.CLEANER && (
                <>
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
                        {errors.paymentPerMonth.message as string}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Address and Parents Information Container */}
            <div className="flex gap-6">
              {/* Address Information */}
              <div className="bg-gray-800 p-6 rounded-lg flex-1">
                <h2 className="text-xl font-bold mb-4 text-white">
                  Address Information
                </h2>
                <div className="grid grid-cols-1 gap-6">
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
                        {errors.presentAddress.message as string}
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
                  </div>
                </div>
              </div>

              {/* Parents Information */}
              {selectedEmployeeType === EmployeeType.TEACHER && (
                <>
                  <div className="bg-gray-800 p-6 rounded-lg flex-1">
                    <h2 className="text-xl font-bold mb-4 text-white">
                      Parents Information
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">
                          Father&apos;s Name
                        </label>
                        <input
                          type="text"
                          {...register("father.name")}
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.father?.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.father.name.message as string}
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
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.father?.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.father.phone.message as string}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-white">
                          Mother&apos;s Name
                        </label>
                        <input
                          type="text"
                          {...register("mother.name")}
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.mother?.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.mother.name.message as string}
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
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.mother?.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.mother.phone.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Educational Background */}
            {selectedEmployeeType === EmployeeType.TEACHER && (
              <>
                <div className="bg-gray-800 p-6 rounded-lg mt-6">
                  <h2 className="text-xl font-bold mb-4 text-white">
                    Educational Background
                  </h2>

                  {/* University Information */}
                  <div className="border border-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        University Information
                      </h3>
                      <label className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={isCurrentlyStudying}
                          onChange={handleIsCurrentlyStudyingChange}
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
                          {...register(
                            "educationalBackground.university.institute"
                          )}
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.educationalBackground?.university
                          ?.institute && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.educationalBackground.university.institute
                                .message as string
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
                          {...register(
                            "educationalBackground.university.department"
                          )}
                          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        {errors.educationalBackground?.university
                          ?.department && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.educationalBackground.university.department
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {!isCurrentlyStudying ? (
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
                            {errors.educationalBackground?.university
                              ?.passingYear && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.university
                                    .passingYear.message as string
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
                              {...register(
                                "educationalBackground.university.cgpa"
                              )}
                              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.educationalBackground?.university?.cgpa && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.university.cgpa
                                    .message as string
                                }
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
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
                          {errors.educationalBackground?.university
                            ?.admissionYear && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                errors.educationalBackground.university
                                  .admissionYear.message as string
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* HSC and SSC Information */}
                  <div className="flex gap-4">
                    {/* HSC Information */}
                    <div className="flex-1 border border-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-white">
                        HSC Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-white">
                            Institute
                          </label>
                          <input
                            type="text"
                            {...register("educationalBackground.hsc.institute")}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                          />
                          {errors.educationalBackground?.hsc?.institute && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                errors.educationalBackground.hsc.institute
                                  .message as string
                              }
                            </p>
                          )}
                        </div>

                        {/* Group, Year, Result in one line */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Group
                            </label>
                            <Listbox
                              value={selectedHscGroup}
                              onChange={(value) => {
                                setSelectedHscGroup(value);
                                setValue(
                                  "educationalBackground.hsc.group",
                                  value as Group
                                );
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
                                        `${
                                          active
                                            ? "bg-primary text-white"
                                            : "text-white"
                                        }
                                cursor-pointer select-none relative py-2 pl-10 pr-4`
                                      }
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
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

                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Year
                            </label>
                            <input
                              type="number"
                              {...register("educationalBackground.hsc.year")}
                              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.educationalBackground?.hsc?.year && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.hsc.year
                                    .message as string
                                }
                              </p>
                            )}
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Result
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register("educationalBackground.hsc.result")}
                              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.educationalBackground?.hsc?.result && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.hsc.result
                                    .message as string
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SSC Information */}
                    <div className="flex-1 border border-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-white">
                        SSC Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-white">
                            Institute
                          </label>
                          <input
                            type="text"
                            {...register("educationalBackground.ssc.institute")}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                          />
                          {errors.educationalBackground?.ssc?.institute && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                errors.educationalBackground.ssc.institute
                                  .message as string
                              }
                            </p>
                          )}
                        </div>

                        {/* Group, Year, Result in one line */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Group
                            </label>
                            <Listbox
                              value={selectedSscGroup}
                              onChange={(value) => {
                                setSelectedSscGroup(value);
                                setValue(
                                  "educationalBackground.ssc.group",
                                  value as Group
                                );
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
                                        `${
                                          active
                                            ? "bg-primary text-white"
                                            : "text-white"
                                        }
                                cursor-pointer select-none relative py-2 pl-10 pr-4`
                                      }
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
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

                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Year
                            </label>
                            <input
                              type="number"
                              {...register("educationalBackground.ssc.year")}
                              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.educationalBackground?.ssc?.year && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.ssc.year
                                    .message as string
                                }
                              </p>
                            )}
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1 text-white">
                              Result
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register("educationalBackground.ssc.result")}
                              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.educationalBackground?.ssc?.result && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.educationalBackground.ssc.result
                                    .message as string
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-800 p-6 rounded-lg mt-6">
                  <h2 className="text-xl font-bold mb-4 text-white">
                    Comments
                  </h2>
                  <div>
                    <textarea
                      {...register("comments")}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                      rows={3}
                      placeholder="Add any additional comments..."
                    />
                    {errors.comments && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.comments.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/employees/employees")}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
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
                        Creating...
                      </>
                    ) : (
                      "Create Employee"
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </form>

      <SuccessPopup
        isOpen={successPopup}
        onClose={() => setSuccessPopup(false)}
        message="Employee created successfully!"
      />
      <FailedPopup
        isOpen={failedPopup}
        onClose={() => setFailedPopup(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default CreateEmployeeComponent;
