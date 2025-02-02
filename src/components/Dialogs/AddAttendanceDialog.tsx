import { Dialog, Listbox } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";

type AttendanceFormData = {
  staffId: string;
  staffName: string;
  date: string;
  inTime: string;
  outTime: string;
  comments?: string;
};

interface AddAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AttendanceFormData) => Promise<void>;
  uniqueNames: string[];
}

const AddAttendanceDialog: React.FC<AddAttendanceDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  uniqueNames,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPerson, setSelectedPerson] = useState("");

  const callApi = async (data: AttendanceFormData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add attendance");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: AttendanceFormData) => {
    try {
      const formattedData = {
        ...data,
        staffId: selectedPerson,
        staffName: selectedPerson,
      };
      console.log(formattedData);
      await callApi(formattedData);
      await onSubmit(formattedData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding attendance:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Add New Attendance
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
              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Person
                </label>
                <Listbox value={selectedPerson} onChange={setSelectedPerson}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-left text-white focus:ring-2 focus:ring-primary">
                      <span className="block truncate">
                        {selectedPerson || "Select staff..."}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronUpDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {uniqueNames.map((name) => (
                        <Listbox.Option
                          key={name}
                          value={name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-primary/20 text-white"
                                : "text-gray-200"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                  <HiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {!selectedPerson && (
                  <p className="mt-1 text-sm text-red-500">
                    Please select a staff member
                  </p>
                )}
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

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    In Time
                  </label>
                  <input
                    type="time"
                    {...register("inTime", {
                      required: "In time is required",
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                  />
                  {errors.inTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.inTime.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Out Time
                  </label>
                  <input
                    type="time"
                    {...register("outTime", {
                      required: "Out time is required",
                    })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                  />
                  {errors.outTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.outTime.message}
                    </p>
                  )}
                </div>
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
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-primary hover:bg-primary/80 text-white rounded-md disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Attendance"}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddAttendanceDialog;
