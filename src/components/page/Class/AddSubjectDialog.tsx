import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import { BsFillTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";

type SubjectFormData = {
  subjects: { name: string }[];
};

interface AddSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    defaultValues: {
      subjects: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const handleFormSubmit = async (data: SubjectFormData) => {
    try {
      const subjects = [];
      for (const subject of data.subjects) {
        subjects.push(subject);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subjects),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message || "Failed to create subjects. Please try again."
        );
        return;
      }

      toast.success("Subjects created successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding subjects:", error);
      toast.error("Failed to create subjects. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add New Subject
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
              <div className="space-y-4">
                <div className="border border-white rounded-lg p-4 relative">
                  <div className="absolute -top-3 right-4">
                    <button
                      type="button"
                      onClick={() => append({ name: "" })}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                    >
                      Add another subject
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 gap-4 mb-4 relative bg-white rounded-lg p-4 text-primary mt-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          {...register(`subjects.${index}.name` as const, {
                            required: "Subject name is required",
                          })}
                          className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                          placeholder="Enter subject name"
                        />
                        {errors.subjects?.[index]?.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.subjects[index].name?.message}
                          </p>
                        )}
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                        >
                          <BsFillTrashFill className="text-white text-2xl" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Create Subjects
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSubjectDialog;
