import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Subject {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
  subjects: Subject[];
}

type SubjectOption = {
  value: string;
  label: string;
};

type ClassFormData = {
  class: string;
  subjects: SubjectOption[];
};

interface AddClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated: (newClass: Class) => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({
  isOpen,
  onClose,
  onClassCreated,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectOption[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClassFormData>({
    defaultValues: {
      class: "",
      subjects: [],
    },
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/subjects`
        );
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  // Map subjects to options format
  const subjectOptions: SubjectOption[] = subjects.map((subject) => ({
    value: subject._id,
    label: subject.name,
  }));

  console.log("subjectOptions", subjectOptions);

  const handleFormSubmit = async (data: ClassFormData) => {
    console.log("data", data);
    try {
      // Transform the subjects data to match the required format
      const transformedSubjects = data.subjects.map((subject) => ({
        _id: subject.value,
        name: subject.label,
      }));

      const requestData = {
        name: data.class,
        subjects: transformedSubjects,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      const result = await response.json();
      console.log("Class created:", result);
      toast.success("Class created successfully");

      // Call the callback with the new class data
      onClassCreated(result);

      reset();
      setSelectedSubjects([]);
      onClose();
    } catch (error) {
      console.error("Error adding class:", error);
      toast.error("Failed to create class");
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
                Add New Class
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
              {/* Class Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Class
                </label>
                <input
                  type="text"
                  {...register("class", {
                    required: "Class is required",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                  placeholder="Enter class"
                />
                {errors.class && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.class.message}
                  </p>
                )}
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Subjects
                </label>
                <Select
                  isMulti
                  options={subjectOptions}
                  value={selectedSubjects}
                  onChange={(newValue) => {
                    const typedValue = newValue as SubjectOption[];
                    setSelectedSubjects(typedValue);
                    setValue("subjects", typedValue);
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
                      backgroundColor: state.isFocused ? "#374151" : "#1f2937",
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClassDialog;
