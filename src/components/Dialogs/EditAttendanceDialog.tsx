import { Dialog, Listbox } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { AttendanceStatus } from "@/enums/attendance.enum";
import { AttendanceRecord } from "@/components/page/Attendance/AttendanceComponent";

type EditAttendanceFormData = {
  status: AttendanceStatus;
  comments?: string;
};

interface EditAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: AttendanceRecord;
}

const EditAttendanceDialog: React.FC<EditAttendanceDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  record,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EditAttendanceFormData>({
    defaultValues: {
      status: record.status,
      comments: record.comments,
    },
  });

  const status = watch("status");

  const [error, setError] = useState<Error | null>(null);

  const callApi = async (data: EditAttendanceFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/attendance/${record._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 404) {
        throw new Error("Attendance record not found");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update attendance");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleFormSubmit = async (data: EditAttendanceFormData) => {
    try {
      await callApi(data);
      reset();
      onClose();
      onSuccess();
      toast.success("Attendance updated successfully");
    } catch (error) {
      console.error("Error updating attendance:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update attendance";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
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
                Edit Attendance
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
              {error && (
                <div className="text-red-500 text-sm">{error.message}</div>
              )}

              {/* Employee Name (Fixed) */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Employee
                </label>
                <div className="w-full py-2 pl-3 pr-10 bg-gray-300 rounded text-primary opacity-50 cursor-not-allowed">
                  {`${record.employeeId.firstName} ${record.employeeId.lastName}`}
                </div>
              </div>

              {/* Date (Fixed) */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Date
                </label>
                <div className="w-full py-2 pl-3 pr-10 bg-gray-300 rounded text-primary opacity-50 cursor-not-allowed">
                  {new Date(record.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Status Switch */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Status
                </label>
                <Listbox
                  value={status}
                  onChange={(value) => setValue("status", value)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                      <span className="block truncate">{status}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                      {Object.values(AttendanceStatus).map((statusOption) => (
                        <Listbox.Option
                          key={statusOption}
                          value={statusOption}
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
                                {statusOption}
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
                      Updating...
                    </>
                  ) : (
                    "Update Attendance"
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

export default EditAttendanceDialog;
