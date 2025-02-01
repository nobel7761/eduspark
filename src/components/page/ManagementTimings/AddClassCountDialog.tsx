"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { DIRECTORS } from "@/constants/directors.constants";

const CLASS_OPTIONS = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "Arabic",
  "Drawing",
  "Spoken English",
];

type ProxyClass = {
  teacher: string;
  class: string;
};

type ClassCountFormData = {
  director: string;
  classes: string[];
  hasProxyClass: "yes" | "no";
  proxyClasses: ProxyClass[];
};

interface AddClassCountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClassCountDialog: React.FC<AddClassCountDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [showProxyFields, setShowProxyFields] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClassCountFormData>({
    defaultValues: {
      proxyClasses: [{ teacher: "", class: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "proxyClasses",
  });

  const hasProxyClass = watch("hasProxyClass");

  const handleFormSubmit = async (data: ClassCountFormData) => {
    try {
      // Clean up proxy classes if not needed
      if (data.hasProxyClass === "no") {
        data.proxyClasses = [];
      }
      console.log("data", data);
      reset();
      setShowProxyFields(false);
    } catch (error) {
      console.error("Error adding class count:", error);
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
                Add Class Count
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
                <select
                  {...register("director", {
                    required: "Please select a director",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select director...</option>
                  {DIRECTORS.map((director) => (
                    <option key={director} value={director}>
                      {director}
                    </option>
                  ))}
                </select>
                {errors.director && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.director.message}
                  </p>
                )}
              </div>

              {/* Classes Multiselect */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Classes
                </label>
                <select
                  multiple
                  {...register("classes", {
                    required: "Please select at least one class",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary min-h-[120px]"
                >
                  {CLASS_OPTIONS.map((classOption) => (
                    <option key={classOption} value={classOption}>
                      {classOption === "Arabic" ||
                      classOption === "Drawing" ||
                      classOption === "Spoken English"
                        ? classOption
                        : `Class ${classOption}`}
                    </option>
                  ))}
                </select>
                {errors.classes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.classes.message}
                  </p>
                )}
              </div>

              {/* Proxy Class Radio */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Any proxy class taken?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register("hasProxyClass")}
                      value="yes"
                      onChange={() => setShowProxyFields(true)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register("hasProxyClass")}
                      value="no"
                      onChange={() => setShowProxyFields(false)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Proxy Classes Fields */}
              {hasProxyClass === "yes" && (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-gray-700 rounded-lg"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Who&apos;s Class?
                          </label>
                          <select
                            {...register(
                              `proxyClasses.${index}.teacher` as const,
                              {
                                required: "Please select a teacher",
                              }
                            )}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select teacher...</option>
                            {DIRECTORS.map((director) => (
                              <option key={director} value={director}>
                                {director}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Which Class?
                          </label>
                          <select
                            {...register(
                              `proxyClasses.${index}.class` as const,
                              {
                                required: "Please select a class",
                              }
                            )}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select class...</option>
                            {CLASS_OPTIONS.map((classOption) => (
                              <option key={classOption} value={classOption}>
                                {classOption === "Arabic" ||
                                classOption === "Drawing" ||
                                classOption === "Spoken English"
                                  ? classOption
                                  : `Class ${classOption}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 text-red-400 text-sm hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ teacher: "", class: "" })}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    + Add another proxy class
                  </button>
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
                  className="px-4 py-2 text-sm bg-primary hover:bg-primary/80 text-white rounded-md"
                >
                  Submit
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
