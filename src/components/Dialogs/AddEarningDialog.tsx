import { Dialog, Listbox } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import Select from "react-select";
import { Months, PaymentType } from "@/enums/earning.enum";
import { IEmployee } from "@/types/employee";

interface Student {
  _id: string;
  name: string;
  class: string;
  payment: {
    [key: string]: number;
  };
}

type EarningFormData = {
  studentId: string;
  paymentType: PaymentType[];
  month?: string;
  amount: number;
  comments?: string;
  class: string;
  date: string;
  receivedBy: string;
};

interface AddEarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentTypeOptions = [
  { value: PaymentType.ADMISSION_FEE, label: "Admission Fee" },
  { value: PaymentType.FORM_FEE, label: "Form Fee" },
  { value: PaymentType.MONTHLY_FEE, label: "Monthly Tuition Fee" },
];

const AddEarningDialog: React.FC<AddEarningDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState<IEmployee[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EarningFormData>({
    defaultValues: {
      amount: 0,
    },
    mode: "onBlur",
  });

  const selectedStudentId = watch("studentId");
  const selectedPaymentType = watch("paymentType");
  const selectedDate = watch("date");
  const selectedAmount = watch("amount");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, directorsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/students`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/employees/get-directors`),
        ]);

        if (!studentsResponse.ok || !directorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [studentsData, directorsData] = await Promise.all([
          studentsResponse.json(),
          directorsResponse.json(),
        ]);

        setStudents(studentsData);
        setDirectors(directorsData);

        const uniqueClasses = Array.from(
          new Set(studentsData.map((student: Student) => student.class))
        ).sort((a, b) => Number(a) - Number(b));

        setClasses(uniqueClasses as string[]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedClass) {
      return;
    }
    const filteredStudents = students.filter(
      (student) => student.class === selectedClass
    );
    setStudents(filteredStudents);
  }, [selectedClass]);

  const handleFormSubmit = async (data: EarningFormData) => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (!data.studentId) {
      toast.error("Please select a student");
      return;
    }

    if (!data.paymentType?.length) {
      toast.error("Please select at least one payment type");
      return;
    }

    if (data.paymentType.includes(PaymentType.MONTHLY_FEE) && !data.month) {
      toast.error("Please select a month for monthly fee");
      return;
    }

    if (!data.receivedBy) {
      toast.error("Please select who received the payment");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/earnings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add earning");
      }

      handleClose();
      onSuccess();
      toast.success("Earning record added successfully");
    } catch (error) {
      console.error("Error adding earning:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add earning"
      );
    }
  };

  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  useEffect(() => {
    if (selectedStudent && selectedPaymentType) {
      setValue(
        "amount",
        selectedStudent.payment[
          selectedPaymentType[0] as keyof typeof selectedStudent.payment
        ]
      );
    }
  }, [selectedStudent, selectedPaymentType, setValue]);

  const handleClose = () => {
    reset();
    setSelectedClass("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add New Earning Record
            </Dialog.Title>
            <button
              onClick={handleClose}
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
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Date is required",
                  })}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary ${
                    errors.date ? "border-red-500" : "border-gray-700"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Select Class *
                  </label>
                  <Listbox
                    value={selectedClass}
                    onChange={(value) => {
                      setSelectedClass(value);
                      setValue("class", value, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button
                        className={`relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white 
                        `}
                      >
                        <span className="block truncate">
                          {loading
                            ? "Loading classes..."
                            : selectedClass || "Select Class..."}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                        {classes.map((classItem) => (
                          <Listbox.Option
                            key={classItem}
                            value={classItem}
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
                                  {classItem}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <FaCheckCircle className="h-5 w-5" />
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
              )}

              {selectedClass && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Select Student *
                  </label>
                  <Listbox
                    value={selectedStudentId}
                    onChange={(value) =>
                      setValue("studentId", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                        <span className="block truncate">
                          {loading
                            ? "Loading students..."
                            : selectedStudentId
                            ? students.find((s) => s._id === selectedStudentId)
                                ?.name
                            : "Select Student..."}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                        {students.map((student) => (
                          <Listbox.Option
                            key={student._id}
                            value={student._id}
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
                                  {student.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <FaCheckCircle className="h-5 w-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>
              )}

              {selectedStudentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Payment Type *
                  </label>
                  <Select
                    isMulti
                    options={paymentTypeOptions}
                    value={paymentTypeOptions.filter((option) =>
                      selectedPaymentType?.includes(option.value as PaymentType)
                    )}
                    onChange={(newValue) => {
                      const selectedValues = (
                        newValue as { value: string; label: string }[]
                      ).map((option) => {
                        switch (option.value) {
                          case PaymentType.ADMISSION_FEE:
                            return PaymentType.ADMISSION_FEE;
                          case PaymentType.FORM_FEE:
                            return PaymentType.FORM_FEE;
                          case PaymentType.MONTHLY_FEE:
                            return PaymentType.MONTHLY_FEE;
                          default:
                            return PaymentType.ADMISSION_FEE;
                        }
                      });
                      setValue("paymentType", selectedValues, {
                        shouldValidate: true,
                      });
                    }}
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
                  {errors.paymentType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.paymentType.message}
                    </p>
                  )}
                </div>
              )}

              {selectedPaymentType?.includes(PaymentType.MONTHLY_FEE) && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Select Month *
                  </label>
                  <Listbox
                    value={watch("month")}
                    onChange={(value) =>
                      setValue("month", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                        <span className="block truncate">
                          {watch("month") || "Select Month..."}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                        {Object.values(Months).map((month, index) => (
                          <Listbox.Option
                            key={index}
                            value={month}
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
                                  {month}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <FaCheckCircle className="h-5 w-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  {errors.month && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.month.message}
                    </p>
                  )}
                </div>
              )}

              {selectedPaymentType && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    {...register("amount", {
                      required: "Amount is required",
                      min: {
                        value: 1,
                        message: "Amount must be greater than 0",
                      },
                      max: {
                        value: 1000000,
                        message: "Amount cannot exceed 1,000,000",
                      },
                      validate: (value) => {
                        if (isNaN(value)) return "Please enter a valid number";
                        return true;
                      },
                    })}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary ${
                      errors.amount ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              )}

              {selectedAmount > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Received By *
                  </label>
                  <Listbox
                    value={watch("receivedBy")}
                    onChange={(value) =>
                      setValue("receivedBy", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                        <span className="block truncate">
                          {loading
                            ? "Loading directors..."
                            : watch("receivedBy")
                            ? directors.find(
                                (d) => d._id === watch("receivedBy")
                              )
                              ? `${
                                  directors.find(
                                    (d) => d._id === watch("receivedBy")
                                  )?.firstName
                                } ${
                                  directors.find(
                                    (d) => d._id === watch("receivedBy")
                                  )?.lastName
                                }`
                              : "Select Receiver..."
                            : "Select Receiver..."}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                        {directors.map((director) => (
                          <Listbox.Option
                            key={director._id}
                            value={director._id}
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
                                  {`${director.firstName} ${director.lastName}`}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <FaCheckCircle className="h-5 w-5" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  {errors.receivedBy && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.receivedBy.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Comments
                </label>
                <textarea
                  {...register("comments")}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                  placeholder="Add any comments..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md"
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
                      Adding...
                    </>
                  ) : (
                    "Add Earning Record"
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

export default AddEarningDialog;
