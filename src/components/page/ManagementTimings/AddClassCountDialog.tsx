"use client";

import { Dialog, Listbox, RadioGroup } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { HiChevronUpDown } from "react-icons/hi2";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { IDirector } from "@/types/directors";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";

type ProxyClass = {
  teacher: string;
  class: string;
  comments?: string;
};

type ClassEntry = {
  selectedClass: string;
  count: number;
  comments: string;
};

type ClassCountFormData = {
  director: string;
  date: string;
  classes: ClassEntry[];
  hasProxyClass: "yes" | "no";
  proxyClasses: ProxyClass[];
};

interface AddClassCountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Class {
  _id: string;
  name: string;
  subjects: { _id: string; name: string }[];
}

const AddClassCountDialog: React.FC<AddClassCountDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [showProxyFields, setShowProxyFields] = useState(false);
  const [allDirectors, setAllDirectors] = useState<IDirector[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);

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

  // Add useEffect to fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/classes`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setAllClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
      }
    };

    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClassCountFormData>({
    defaultValues: {
      classes: [{ selectedClass: "", count: 0, comments: "" }],
      proxyClasses: [{ teacher: "", class: "" }],
      hasProxyClass: "no",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "proxyClasses",
  });

  const {
    fields: classFields,
    append: appendClass,
    remove: removeClass,
  } = useFieldArray({
    control,
    name: "classes",
  });

  const handleFormSubmit = async (data: ClassCountFormData) => {
    try {
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
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-6 bg-gray-900 border-b border-gray-800">
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

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Director Selection with Headless UI Listbox */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Director
                </label>
                <Listbox
                  value={watch("director")}
                  onChange={(value) => setValue("director", value)}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary text-left flex justify-between items-center">
                      <span>
                        {allDirectors.find((d) => d._id === watch("director"))
                          ?.name || "Select director..."}
                      </span>
                      <HiChevronUpDown className="h-5 w-5" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                      {allDirectors.map((director) => (
                        <Listbox.Option
                          key={director._id}
                          value={director._id}
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-2 px-4 ${
                              active
                                ? "bg-gray-700 text-white"
                                : "text-gray-300"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center">
                              {selected && (
                                <FaCheckCircle className="text-blue-600 mr-2" />
                              )}
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {director.name}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {errors.director && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.director.message}
                  </p>
                )}
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Please select a date",
                  })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Wrap Class Selection, Count, and Comments in a border */}
              <div className="border border-white rounded-lg p-4 space-y-2 relative">
                <div className="absolute -top-3 right-4">
                  <button
                    type="button"
                    onClick={() =>
                      appendClass({ selectedClass: "", count: 0, comments: "" })
                    }
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    Add another class
                  </button>
                </div>

                {classFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <div className="space-y-4 bg-white rounded-lg p-4 text-primary my-4">
                      {/* Class Selection and Count in same line */}
                      <div className="flex gap-4">
                        {/* Class Selection with Headless UI Listbox */}
                        <div className="relative flex-grow">
                          <label className="block text-sm font-medium mb-2">
                            Select Class
                          </label>
                          <Listbox
                            value={watch(`classes.${index}.selectedClass`)}
                            onChange={(value) =>
                              setValue(`classes.${index}.selectedClass`, value)
                            }
                          >
                            <div className="relative">
                              <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                <span>
                                  {allClasses.find(
                                    (c) =>
                                      c._id ===
                                      watch(`classes.${index}.selectedClass`)
                                  )?.name || "Select class..."}
                                </span>
                                <HiChevronUpDown className="h-5 w-5" />
                              </Listbox.Button>
                              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                {allClasses.map((classItem) => (
                                  <Listbox.Option
                                    key={classItem._id}
                                    value={classItem._id}
                                    className={({ active }) =>
                                      `cursor-pointer select-none relative py-2 px-4 ${
                                        active
                                          ? "bg-gray-100 text-primary"
                                          : "text-gray-900"
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                      <div className="flex items-center">
                                        {selected && (
                                          <FaCheckCircle className="text-blue-600 mr-2" />
                                        )}
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {classItem.name}
                                        </span>
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </div>
                          </Listbox>
                          {errors.classes?.[index]?.selectedClass && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.classes[index].selectedClass?.message}
                            </p>
                          )}
                        </div>

                        {/* Count Input */}
                        <div className="w-32">
                          <label className="block text-sm font-medium mb-2">
                            Count
                          </label>
                          <input
                            type="number"
                            {...register(`classes.${index}.count`, {
                              required: "Please enter count",
                              min: {
                                value: 1,
                                message: "Count must be at least 1",
                              },
                            })}
                            className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                          />
                          {errors.classes?.[index]?.count && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.classes[index].count?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Comments on new line */}
                      <div className="w-full">
                        <label className="block text-sm font-medium mb-2">
                          Comments
                        </label>
                        <input
                          type="text"
                          {...register(`classes.${index}.comments`)}
                          className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                          placeholder="Add any comments..."
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeClass(index)}
                        className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                      >
                        <BsFillTrashFill className="text-white text-xl" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Proxy Class Radio */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Any proxy class taken?
                </label>
                <RadioGroup
                  value={watch("hasProxyClass")}
                  onChange={(value) => {
                    setValue("hasProxyClass", value);
                    setShowProxyFields(value === "yes");
                  }}
                  className="flex gap-4"
                >
                  <RadioGroup.Option value="yes">
                    {({ checked }) => (
                      <div className="flex items-center">
                        <div
                          className={`
                          w-4 h-4 rounded-full border
                          ${
                            checked
                              ? "border-white bg-transparent"
                              : "border-gray-400"
                          }
                          flex items-center justify-center
                        `}
                        >
                          {checked && (
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="ml-2 text-gray-200">Yes</span>
                      </div>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value="no">
                    {({ checked }) => (
                      <div className="flex items-center">
                        <div
                          className={`
                          w-4 h-4 rounded-full border
                          ${
                            checked
                              ? "border-white bg-transparent"
                              : "border-gray-400"
                          }
                          flex items-center justify-center
                        `}
                        >
                          {checked && (
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="ml-2 text-gray-200">No</span>
                      </div>
                    )}
                  </RadioGroup.Option>
                </RadioGroup>
              </div>

              {/* Proxy Classes Fields */}
              {showProxyFields && (
                <div className="border border-white rounded-lg p-4 space-y-2 relative">
                  <div className="absolute -top-3 right-4">
                    <button
                      type="button"
                      onClick={() => append({ teacher: "", class: "" })}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                    >
                      Add another proxy
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="relative">
                      <div className="space-y-4 bg-white rounded-lg p-4 text-primary my-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Who&apos;s Class?
                            </label>
                            <Listbox
                              value={watch(`proxyClasses.${index}.teacher`)}
                              onChange={(value) =>
                                setValue(`proxyClasses.${index}.teacher`, value)
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                  <span>
                                    {allDirectors.find(
                                      (d) =>
                                        d._id ===
                                        watch(`proxyClasses.${index}.teacher`)
                                    )?.name || "Select teacher..."}
                                  </span>
                                  <HiChevronUpDown className="h-5 w-5" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                  {allDirectors.map((director) => (
                                    <Listbox.Option
                                      key={director._id}
                                      value={director._id}
                                      className={({ active }) =>
                                        `cursor-pointer select-none relative py-2 px-4 ${
                                          active
                                            ? "bg-gray-100 text-primary"
                                            : "text-gray-900"
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <div className="flex items-center">
                                          {selected && (
                                            <FaCheckCircle className="text-blue-600 mr-2" />
                                          )}
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {director.name}
                                          </span>
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Which Class?
                            </label>
                            <Listbox
                              value={watch(`proxyClasses.${index}.class`)}
                              onChange={(value) =>
                                setValue(`proxyClasses.${index}.class`, value)
                              }
                            >
                              <div className="relative">
                                <Listbox.Button className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none text-left flex justify-between items-center">
                                  <span>
                                    {allClasses.find(
                                      (c) =>
                                        c._id ===
                                        watch(`proxyClasses.${index}.class`)
                                    )?.name || "Select class..."}
                                  </span>
                                  <HiChevronUpDown className="h-5 w-5" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-primary rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
                                  {allClasses.map((classItem) => (
                                    <Listbox.Option
                                      key={classItem._id}
                                      value={classItem._id}
                                      className={({ active }) =>
                                        `cursor-pointer select-none relative py-2 px-4 ${
                                          active
                                            ? "bg-gray-100 text-primary"
                                            : "text-gray-900"
                                        }`
                                      }
                                    >
                                      {({ selected }) => (
                                        <div className="flex items-center">
                                          {selected && (
                                            <FaCheckCircle className="text-blue-600 mr-2" />
                                          )}
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {classItem.name}
                                          </span>
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                        </div>
                        {/* Comments */}
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-2">
                            Comments
                          </label>
                          <input
                            type="text"
                            {...register(
                              `proxyClasses.${index}.comments` as const
                            )}
                            className="w-full bg-transparent border border-primary rounded-lg px-4 py-2.5 text-primary focus:ring-0 focus:ring-none"
                            placeholder="Add any comments..."
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5"
                        >
                          <BsFillTrashFill className="text-white text-xl" />
                        </button>
                      )}
                    </div>
                  ))}
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
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
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
