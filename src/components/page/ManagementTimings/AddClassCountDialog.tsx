"use client";

import { Dialog, Listbox, RadioGroup } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { HiChevronUpDown } from "react-icons/hi2";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
import { IEmployee } from "@/types/employee";

type ProxyClass = {
  employeeId: string;
  classId: string;
  comments?: string;
};

type ClassEntry = {
  classId: string;
  count: number;
  comments: string;
};

type ClassCountFormData = {
  employeeId: string;
  date: string;
  classes: ClassEntry[];
  hasProxyClass: boolean;
  proxyClasses: ProxyClass[];
};

interface AddClassCountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classBasedTeachers: IEmployee[];
  teacherDetails: IEmployee[];
  onSubmitSuccess: () => void;
}

interface Class {
  _id: string;
  name: string;
  subjects: { _id: string; name: string }[];
}

const AddClassCountDialog: React.FC<AddClassCountDialogProps> = ({
  isOpen,
  onClose,
  classBasedTeachers,
  teacherDetails,
  onSubmitSuccess,
}) => {
  const [showProxyFields, setShowProxyFields] = useState(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClassCountFormData>({
    defaultValues: {
      classes: [
        { classId: "3-8", count: 0, comments: "" },
        { classId: "9-10", count: 0, comments: "" },
        { classId: "11-12", count: 0, comments: "" },
      ],
      proxyClasses: [{ employeeId: "", classId: "" }],
      hasProxyClass: false,
    },
  });

  // Add useEffect to fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/classes`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setAllClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
      }
    };

    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "proxyClasses",
  });

  // const {
  //   fields: classFields,
  //   append: appendClass,
  //   remove: removeClass,
  // } = useFieldArray({
  //   control,
  //   name: "classes",
  // });

  const handleFormSubmit = async (data: ClassCountFormData) => {
    try {
      // Add validation to check if all class counts are zero
      const allClassesZero = data.classes.every(
        (classItem) => Number(classItem.count) === 0
      );

      if (allClassesZero) {
        toast.error("At least one class range must have a non-zero value");
        return;
      }

      if (!data.hasProxyClass) {
        data.proxyClasses = [];
      }

      if (data.date) {
        data.date = new Date(data.date).toISOString();
      }

      if (data.classes.length > 0) {
        data.classes = data.classes.map((classItem) => ({
          ...classItem,
          count: Number(classItem.count),
        }));
      }
      // Group classes by range and get their IDs
      const classRanges = {
        "3-8": allClasses.filter((c) =>
          ["3", "4", "5", "6", "7", "8"].includes(c.name)
        ),
        "9-10": allClasses.filter((c) => ["9", "10"].includes(c.name)),
        "11-12": allClasses.filter((c) => ["11", "12"].includes(c.name)),
      };

      // Transform the classes data
      const transformedClasses = data.classes.map((classItem) => ({
        classIds: classRanges[
          classItem.classId as keyof typeof classRanges
        ].map((c) => c._id),
        count: Number(classItem.count),
        comments: classItem.comments || "",
      }));

      // Prepare the final data structure
      const formattedData = {
        employeeId: data.employeeId,
        date: data.date ? new Date(data.date).toISOString() : null,
        classes: transformedClasses,
        hasProxyClass: data.hasProxyClass,
        proxyClasses: data.hasProxyClass ? data.proxyClasses : [],
      };

      // Make API call to create class count
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/monthly-class-count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create class count");
      }

      // Show success message
      toast.success("Class count added successfully");

      // Call the success callback to refresh parent data
      onSubmitSuccess();

      // Reset form and close dialog
      reset({
        employeeId: "",
        date: "",
        classes: [
          { classId: "3-8", count: 0, comments: "" },
          { classId: "9-10", count: 0, comments: "" },
          { classId: "11-12", count: 0, comments: "" },
        ],
        proxyClasses: [{ employeeId: "", classId: "" }],
        hasProxyClass: false,
      });

      setShowProxyFields(false);
      onClose();
    } catch (error) {
      console.error("Error adding class count:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create class count"
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add Class Count
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Director Selection with Headless UI Listbox */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Teacher
                </label>

                <Listbox
                  value={watch("employeeId")}
                  onChange={(value) => setValue("employeeId", value)}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary text-left flex justify-between items-center">
                      <span>
                        {teacherDetails.find(
                          (t) => t._id === watch("employeeId")
                        )
                          ? `${
                              teacherDetails.find(
                                (t) => t._id === watch("employeeId")
                              )?.firstName
                            } ${
                              teacherDetails.find(
                                (t) => t._id === watch("employeeId")
                              )?.lastName
                            }`
                          : "Select teacher..."}
                      </span>
                      <HiChevronUpDown className="h-5 w-5" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                      {teacherDetails.map((teacher) => (
                        <Listbox.Option
                          key={teacher._id}
                          value={teacher._id}
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-2 px-4 ${
                              active
                                ? "bg-gray-700 text-white"
                                : "text-gray-300"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center">
                              {selected && (
                                <FaCheckCircle className="text-blue-600 mr-2" />
                              )}
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {teacher.firstName + " " + teacher.lastName}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Please select a date",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Wrap Class Selection, Count, and Comments in a border */}
              {/* <div className="border border-white rounded-lg p-4 space-y-2">
                <div className="absolute -top-3 right-4">
                  <button
                    type="button"
                    onClick={() =>
                      appendClass({ classId: "", count: 0, comments: "" })
                    }
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    Add another class
                  </button>
                </div>

                {classFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <div className="space-y-4 bg-white rounded-lg p-4 text-primary my-4">
                      <div className="flex gap-4">
                        <div className="relative flex-grow">
                          <label className="block text-sm font-medium mb-2">
                            Select Class
                          </label>
                          <Listbox
                            value={watch(`classes.${index}.classId`)}
                            onChange={(value) =>
                              setValue(`classes.${index}.classId`, value)
                            }
                          >
                            <div className="relative">
                              <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                <span>
                                  {allClasses.find(
                                    (c) =>
                                      c._id ===
                                      watch(`classes.${index}.classId`)
                                  )?.name || "Select class..."}
                                </span>
                                <HiChevronUpDown className="h-5 w-5" />
                              </Listbox.Button>
                              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                {allClasses.map((classItem) => (
                                  <Listbox.Option
                                    key={classItem._id}
                                    value={classItem._id}
                                    className={({ active }) =>
                                      `cursor-pointer select-none relative py-2 px-4 ${
                                        active
                                          ? "bg-gray-100 text-primary"
                                          : "text-gray-900"
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                      <div className="flex items-center">
                                        {selected && (
                                          <FaCheckCircle className="text-blue-600 mr-2" />
                                        )}
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {classItem.name}
                                        </span>
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </div>
                          </Listbox>
                          {errors.classes?.[index]?.classId && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.classes[index].classId?.message}
                            </p>
                          )}
                        </div>

                        <div className="w-32">
                          <label className="block text-sm font-medium mb-2">
                            Count
                          </label>
                          <input
                            type="number"
                            {...register(`classes.${index}.count`, {
                              required: "Please enter count",
                              min: {
                                value: 1,
                                message: "Count must be at least 1",
                              },
                            })}
                            className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                          />
                          {errors.classes?.[index]?.count && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.classes[index].count?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full">
                        <label className="block text-sm font-medium mb-2">
                          Comments
                        </label>
                        <input
                          type="text"
                          {...register(`classes.${index}.comments`)}
                          className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                          placeholder="Add any comments..."
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeClass(index)}
                        className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                      >
                        <BsFillTrashFill className="text-white text-xl" />
                      </button>
                    )}
                  </div>
                ))}
              </div> */}

              {/* Replace the existing class fields section with this */}
              <div className="border border-white rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Class 3-8 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Class 3-8
                    </label>
                    <input
                      type="number"
                      {...register("classes.0.count", {
                        min: {
                          value: 0,
                          message: "Count must be 0 or greater",
                        },
                      })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                    />
                    {errors.classes?.[0]?.count && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.classes[0].count?.message}
                      </p>
                    )}
                  </div>

                  {/* Class 9-10 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Class 9-10
                    </label>
                    <input
                      type="number"
                      {...register("classes.1.count", {
                        min: {
                          value: 0,
                          message: "Count must be 0 or greater",
                        },
                      })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                    />
                    {errors.classes?.[1]?.count && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.classes[1].count?.message}
                      </p>
                    )}
                  </div>

                  {/* Class 11-12 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Class 11-12
                    </label>
                    <input
                      type="number"
                      {...register("classes.2.count", {
                        min: {
                          value: 0,
                          message: "Count must be 0 or greater",
                        },
                      })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                    />
                    {errors.classes?.[2]?.count && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.classes[2].count?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comments field */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Comments
                  </label>
                  <input
                    type="text"
                    {...register("classes.0.comments")}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                    placeholder="Add any comments..."
                  />
                </div>
              </div>

              {/* Proxy Class Radio */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Any proxy class taken?
                </label>
                <RadioGroup
                  value={watch("hasProxyClass")}
                  onChange={(value) => {
                    setValue("hasProxyClass", value);
                    setShowProxyFields(value);
                  }}
                  className="flex gap-4"
                >
                  <RadioGroup.Option value={true}>
                    {({ checked }) => (
                      <div className="flex items-center">
                        <div
                          className={`
                          w-4 h-4 rounded-full border
                          ${
                            checked
                              ? "border-white bg-transparent"
                              : "border-gray-400"
                          }
                          flex items-center justify-center
                        `}
                        >
                          {checked && (
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="ml-2 text-gray-200">Yes</span>
                      </div>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value={false}>
                    {({ checked }) => (
                      <div className="flex items-center">
                        <div
                          className={`
                          w-4 h-4 rounded-full border
                          ${
                            checked
                              ? "border-white bg-transparent"
                              : "border-gray-400"
                          }
                          flex items-center justify-center
                        `}
                        >
                          {checked && (
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="ml-2 text-gray-200">No</span>
                      </div>
                    )}
                  </RadioGroup.Option>
                </RadioGroup>
              </div>

              {/* Proxy Classes Fields */}
              {showProxyFields && (
                <div className="border border-white rounded-lg p-4 space-y-2 relative">
                  <div className="absolute -top-3 right-4">
                    <button
                      type="button"
                      onClick={() => append({ employeeId: "", classId: "" })}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                    >
                      Add another proxy
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="relative">
                      <div className="space-y-4 bg-white rounded-lg p-4 text-primary my-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Who&apos;s Class?
                            </label>
                            <Listbox
                              value={watch(`proxyClasses.${index}.employeeId`)}
                              onChange={(value) =>
                                setValue(
                                  `proxyClasses.${index}.employeeId`,
                                  value
                                )
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                  <span>
                                    {(() => {
                                      const teacher = classBasedTeachers.find(
                                        (t) =>
                                          t._id ===
                                          watch(
                                            `proxyClasses.${index}.employeeId`
                                          )
                                      );
                                      return teacher
                                        ? `${teacher.firstName} ${teacher.lastName}`
                                        : "Select teacher...";
                                    })()}
                                  </span>
                                  <HiChevronUpDown className="h-5 w-5" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                  {classBasedTeachers.map((teacher) => (
                                    <Listbox.Option
                                      key={teacher._id}
                                      value={teacher._id}
                                      className={({ active }) =>
                                        `cursor-pointer select-none relative py-2 px-4 ${
                                          active
                                            ? "bg-gray-100 text-primary"
                                            : "text-gray-900"
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <div className="flex items-center">
                                          {selected && (
                                            <FaCheckCircle className="text-blue-600 mr-2" />
                                          )}
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {teacher.firstName +
                                              " " +
                                              teacher.lastName}
                                          </span>
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Which Class?
                            </label>
                            <Listbox
                              value={watch(`proxyClasses.${index}.classId`)}
                              onChange={(value) =>
                                setValue(`proxyClasses.${index}.classId`, value)
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                  <span>
                                    {allClasses.find(
                                      (c) =>
                                        c._id ===
                                        watch(`proxyClasses.${index}.classId`)
                                    )?.name || "Select class..."}
                                  </span>
                                  <HiChevronUpDown className="h-5 w-5" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                  {allClasses.map((classItem) => (
                                    <Listbox.Option
                                      key={classItem._id}
                                      value={classItem._id}
                                      className={({ active }) =>
                                        `cursor-pointer select-none relative py-2 px-4 ${
                                          active
                                            ? "bg-gray-100 text-primary"
                                            : "text-gray-900"
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <div className="flex items-center">
                                          {selected && (
                                            <FaCheckCircle className="text-blue-600 mr-2" />
                                          )}
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {classItem.name}
                                          </span>
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                        </div>
                        {/* Comments */}
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-2">
                            Comments
                          </label>
                          <input
                            type="text"
                            {...register(
                              `proxyClasses.${index}.comments` as const
                            )}
                            className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                            placeholder="Add any comments..."
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                        >
                          <BsFillTrashFill className="text-white text-xl" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
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
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClassCountDialog;
