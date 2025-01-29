import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";

type AttendanceFormData = {
  staffId: string;
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

  const handleFormSubmit = async (data: AttendanceFormData) => {
    await onSubmit(data);
    reset();
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
              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Person
                </label>
                <select
                  {...register("staffId", {
                    required: "Please select a staff member",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select staff...</option>
                  {uniqueNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.staffId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.staffId.message}
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

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 transition-colors"
              >
                Submit Attendance
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddAttendanceDialog;
