import { Dialog, Listbox } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { IEmployee } from "@/types/employee";

type InvestmentFormData = {
  employeeId: string;
  date: string;
  amount: number;
  comments?: string;
};

interface AddInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [directors, setDirectors] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormData>();

  const selectedEmployeeId = watch("employeeId");

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/employees/get-directors`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch directors");
        }
        const data = await response.json();
        setDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
        toast.error("Failed to load directors");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDirectors();
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: InvestmentFormData) => {
    try {
      const finalData = {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date).toISOString(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/investments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add investment");
      }

      reset();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error adding investment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add investment"
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Add New Investment
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <IoClose size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Director Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Director
                </label>
                <Listbox
                  value={selectedEmployeeId}
                  onChange={(value) => setValue("employeeId", value)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                      <span className="block truncate">
                        {loading
                          ? "Loading directors..."
                          : selectedEmployeeId
                          ? directors.find(
                              (dir) => dir._id === selectedEmployeeId
                            )
                            ? `${
                                directors.find(
                                  (dir) => dir._id === selectedEmployeeId
                                )?.firstName
                              } ${
                                directors.find(
                                  (dir) => dir._id === selectedEmployeeId
                                )?.lastName
                              }`
                            : "Select Director..."
                          : "Select Director..."}
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
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Investment Amount
                </label>
                <input
                  type="number"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be greater than 0" },
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Comments */}
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
                  onClick={onClose}
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
                    "Add Investment"
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

export default AddInvestmentDialog;
