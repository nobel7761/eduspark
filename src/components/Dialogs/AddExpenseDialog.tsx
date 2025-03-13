import { Dialog, Listbox } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { ExpenseType } from "@/enums/expense.enum";
import { IEmployee } from "@/types/employee";
import Select from "react-select";

type ExpenseFormData = {
  purpose: ExpenseType[];
  amount: number;
  comments?: string;
  date: string;
  paidBy: string;
};

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const expenseTypeOptions = [
  { value: ExpenseType.TEACHER_SALARY, label: "Teacher Salary" },
  { value: ExpenseType.STAFF_SALARY, label: "Staff Salary" },
  { value: ExpenseType.RENT, label: "Rent" },
  { value: ExpenseType.WATER_BILL, label: "Water Bill" },
  { value: ExpenseType.ELECTRICITY_BILL, label: "Electricity Bill" },
  { value: ExpenseType.INTERNET_BILL, label: "Internet Bill" },
  { value: ExpenseType.OTHER_BILLS, label: "Other Bills" },
];

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [directors, setDirectors] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurposes, setSelectedPurposes] = useState<ExpenseType[]>([]);
  const [selectedPaidBy, setSelectedPaidBy] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchDirectors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/employees/get-directors`
        );
        if (!response.ok) throw new Error("Failed to fetch directors");
        const data = await response.json();
        setDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
        toast.error("Failed to load directors");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  const handleFormSubmit = async (data: ExpenseFormData) => {
    if (!data.purpose) {
      toast.error("Please select at least one purpose");
      return;
    }

    if (!data.amount) {
      toast.error("Please enter the amount");
      return;
    }

    if (!data.date) {
      toast.error("Please select the date");
      return;
    }

    if (!selectedPaidBy) {
      toast.error("Please select who paid the expense");
      return;
    }

    data.amount = Number(data.amount);
    data.date = new Date(data.date).toISOString();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            purpose: selectedPurposes,
            paidBy: selectedPaidBy,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }

      handleClose();
      onSuccess();
      toast.success("Expense record added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add expense"
      );
    }
  };

  const handleClose = () => {
    reset();
    setSelectedPurposes([]);
    setSelectedPaidBy("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-gray-900 text-white">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <Dialog.Title className="text-lg font-semibold">
              Add New Expense Record
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Purpose Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Purpose *
                  </label>
                  <Select
                    isDisabled={isSubmitting}
                    isMulti
                    options={expenseTypeOptions}
                    value={expenseTypeOptions.filter((option) =>
                      selectedPurposes.includes(option.value)
                    )}
                    onChange={(newValue) => {
                      const selectedValues = (
                        newValue as { value: ExpenseType; label: string }[]
                      ).map((option) => option.value);
                      setSelectedPurposes(selectedValues);
                      setValue("purpose", selectedValues, {
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
                  {errors.purpose && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.purpose.message}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    disabled={isSubmitting}
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
                    })}
                    className="w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary border-gray-700"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    disabled={isSubmitting}
                    {...register("date", { required: "Date is required" })}
                    className="w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary border-gray-700"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Paid By */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Paid By *
                  </label>
                  <Listbox
                    disabled={isSubmitting}
                    value={selectedPaidBy}
                    onChange={(value) => {
                      setSelectedPaidBy(value);
                      setValue("paidBy", value);
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                        <span className="block truncate">
                          {selectedPaidBy
                            ? directors.find((d) => d._id === selectedPaidBy)
                              ? `${
                                  directors.find(
                                    (d) => d._id === selectedPaidBy
                                  )?.firstName
                                } ${
                                  directors.find(
                                    (d) => d._id === selectedPaidBy
                                  )?.lastName
                                }`
                              : "Select director..."
                            : "Select director..."}
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
                                  {director.firstName} {director.lastName}
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

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Comments
                  </label>
                  <textarea
                    disabled={isSubmitting}
                    {...register("comments")}
                    rows={3}
                    className="w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary border-gray-700"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
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
                  "Add Expense"
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddExpenseDialog;
