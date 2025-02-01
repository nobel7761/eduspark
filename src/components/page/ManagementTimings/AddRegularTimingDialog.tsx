"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import SuccessPopup from "@/components/UI/SuccessPopup";
import { IDirector } from "@/types/directors";
import FailedPopup from "@/components/UI/FailedPopup";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Update the types
type TimingEntry = {
  inTime: string;
  outTime: string;
};

type RegularTimingFormData = {
  directorId: string;
  date: string;
  timings: TimingEntry[];
  comments?: string;
};

type FormattedTimingData = {
  directorId: string;
  date: string;
  timings: {
    inTime: string;
    outTime: string;
  }[];
  comments?: string;
};

interface AddRegularTimingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRegularTimingDialog: React.FC<AddRegularTimingDialogProps> = ({
  isOpen,
  onClose,
}) => {
  // Add state for directors
  const [allDirectors, setAllDirectors] = useState<IDirector[]>([]);

  // Add useEffect to fetch directors
  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/directors`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch directors");
        }
        const data = await response.json();
        setAllDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
        toast.error("Failed to load directors");
      }
    };

    fetchDirectors();
  }, []);

  // Add state for managing smooth close
  const [isClosing, setIsClosing] = useState(false);

  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    message: "",
  });

  const [failedPopup, setFailedPopup] = useState({
    isOpen: false,
    message: "",
  });

  const defaultValues = {
    directorId: "",
    date: "",
    timings: [{ inTime: "", outTime: "" }],
    comments: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegularTimingFormData>({
    defaultValues,
  });

  const timings = watch("timings");

  // Modified close handler
  const handleClose = () => {
    setIsClosing(true);
    // Delay actual close to allow animation
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleFormSubmit = async (data: RegularTimingFormData) => {
    try {
      const baseDate = dayjs(data.date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .utc(true);

      // Sort timings by inTime for easier comparison
      const sortedTimings = [...data.timings].sort((a, b) => {
        return a.inTime.localeCompare(b.inTime);
      });

      // Check for overlapping time slots
      for (let i = 0; i < sortedTimings.length - 1; i++) {
        const currentSlot = sortedTimings[i];
        const nextSlot = sortedTimings[i + 1];

        const currentOutTime = dayjs(`${data.date} ${currentSlot.outTime}`);
        const nextInTime = dayjs(`${data.date} ${nextSlot.inTime}`);

        if (nextInTime.isBefore(currentOutTime)) {
          toast.error("Time slots cannot overlap. Please check your entries.");
          return; // Return early if there's an overlap
        }
      }

      // Process all timing entries
      const formattedTimings = sortedTimings.map((timing) => {
        const [inHours, inMinutes] = timing.inTime.split(":").map(Number);
        const [outHours, outMinutes] = timing.outTime.split(":").map(Number);

        const inDateTime = dayjs(data.date)
          .hour(inHours)
          .minute(inMinutes)
          .second(0)
          .millisecond(0)
          .utc(true);

        const outDateTime = dayjs(data.date)
          .hour(outHours)
          .minute(outMinutes)
          .second(0)
          .millisecond(0)
          .utc(true);

        if (outDateTime.isBefore(inDateTime)) {
          throw new Error("Out time must be after in time for each slot");
        }

        return {
          inTime: inDateTime.toISOString(),
          outTime: outDateTime.toISOString(),
        };
      });

      const formattedData: FormattedTimingData = {
        directorId: data.directorId,
        date: baseDate.toISOString(),
        timings: formattedTimings,
        comments: data.comments,
      };

      // Add API call to store the data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/management-regular-timing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        setFailedPopup({
          isOpen: true,
          message: "Failed to add regular timing",
        });

        // Close the failed popup after 4 seconds
        setTimeout(() => {
          setFailedPopup({ isOpen: false, message: "" });
        }, 4000);
      }

      // Show success popup with formatted date
      const formattedDate = dayjs(data.date).format("MMMM D, YYYY");
      const directorName =
        allDirectors.find((d) => d._id === data.directorId)?.name || "Director";
      setSuccessPopup({
        isOpen: true,
        message: `Regular timing for ${directorName} added successfully on ${formattedDate}`,
      });

      // Reset form and close dialog after delay
      reset(defaultValues);

      // Close the popup after 4 seconds
      setTimeout(() => {
        setSuccessPopup({ isOpen: false, message: "" });
        handleClose();
      }, 4000);
    } catch (error) {
      setFailedPopup({
        isOpen: true,
        message: error instanceof Error ? error.message : "An error occurred",
      });

      // Close the failed popup after 4 seconds
      setTimeout(() => {
        setFailedPopup({ isOpen: false, message: "" });
      }, 4000);
    }
  };

  const addNewTiming = () => {
    const currentTimings = watch("timings");
    const updatedTimings = [...currentTimings, { inTime: "", outTime: "" }];
    // Using setValue from react-hook-form would be better here, but for simplicity
    reset({ ...watch(), timings: updatedTimings });
  };

  const deleteTiming = (index: number) => {
    const currentTimings = watch("timings");
    const updatedTimings = currentTimings.filter((_, i) => i !== index);
    setValue("timings", updatedTimings);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden
          transform transition-all duration-200 ${
            isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add Regular Timing
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
              {/* Director Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Director
                </label>
                <select
                  {...register("directorId", {
                    required: "Please select a director",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select director...</option>
                  {allDirectors.map((director: IDirector) => (
                    <option key={director._id} value={director._id}>
                      {director.name}
                    </option>
                  ))}
                </select>
                {errors.directorId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.directorId.message}
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
              <div className="space-y-4">
                <div className="border border-white rounded-lg p-4 relative">
                  <div className="absolute -top-3 right-4">
                    <button
                      type="button"
                      onClick={addNewTiming}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                    >
                      Add another slot
                    </button>
                  </div>

                  {timings.map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4 mb-4 relative bg-white rounded-lg p-4 text-primary mt-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          In Time
                        </label>
                        <input
                          type="time"
                          {...register(`timings.${index}.inTime` as const, {
                            required: "In time is required",
                          })}
                          className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Out Time
                        </label>
                        <input
                          type="time"
                          {...register(`timings.${index}.outTime` as const, {
                            required: "Out time is required",
                          })}
                          className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => deleteTiming(index)}
                          className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                        >
                          <BsFillTrashFill className="text-white text-2xl" />
                        </button>
                      )}
                    </div>
                  ))}
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
                  onClick={handleClose}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>

      <SuccessPopup
        isOpen={successPopup.isOpen}
        onClose={() => setSuccessPopup({ isOpen: false, message: "" })}
        message={successPopup.message}
        autoCloseDelay={4000}
      />
      <FailedPopup
        isOpen={failedPopup.isOpen}
        onClose={() => setFailedPopup({ isOpen: false, message: "" })}
        message={failedPopup.message}
        autoCloseDelay={4000}
      />
    </Dialog>
  );
};

export default AddRegularTimingDialog;
