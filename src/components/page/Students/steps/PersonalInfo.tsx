import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import {
  // useEffect,
  useState,
} from "react";
// import Image from "next/image";
// import { MdCloudUpload } from "react-icons/md";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";

const PersonalInfoStep = () => {
  const {
    register,
    formState: { errors },
    // watch,
    setValue,
  } = useFormContext();

  // const photoFile = watch("photo");
  // const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedReligion, setSelectedReligion] = useState<string>("");

  // useEffect(() => {
  //   if (photoFile && photoFile[0]) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPhotoPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(photoFile[0]);
  //   }
  // }, [photoFile]);

  // Replace the select element with Listbox
  const genderOptions = ["Male", "Female"];
  const religionOptions = ["Islam", "Hinduism", "Christianity", "Buddhism"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-4 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
      <div className="flex justify-between items-center gap-x-3 my-10">
        {/* photo */}
        {/* <motion.div
          className="w-1/3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="w-[250px] h-[250px] relative">
            <motion.div
              className="w-full h-full flex justify-center items-center overflow-hidden bg-gray-600 rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <svg
                  className="w-[260px] h-[260px] text-gray-400 mt-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </motion.div>
            <motion.label
              className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <input
                type="file"
                accept="image/*"
                {...register("photo", { required: true })}
                className="hidden"
              />
              <MdCloudUpload className="text-3xl text-primary hover:text-white transition-colors" />
            </motion.label>
          </div>
        </motion.div> */}
        {/* name, primaryPhone, secondaryPhone Info */}
        <div className="w-full flex flex-col gap-6">
          {" "}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <label className="block text-sm font-medium mb-1">
              Primary Phone
            </label>
            <input
              type="tel"
              {...register("primaryPhone", {
                required: "Primary phone is required",
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: "Please enter a valid phone number",
                },
              })}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
            {errors.primaryPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.primaryPhone.message as string}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <label className="block text-sm font-medium mb-1">
              Secondary Phone
            </label>
            <input
              type="tel"
              {...register("secondaryPhone")}
              className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            />
          </motion.div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            {...register("dateOfBirth", {
              required: "Date of birth is required",
              validate: (value) => {
                const date = new Date(value);
                return !isNaN(date.getTime()) || "Invalid date format";
              },
              setValueAs: (value) => {
                if (!value) return undefined;
                const date = new Date(value);
                return isNaN(date.getTime()) ? undefined : date;
              },
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dateOfBirth.message as string}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label className="block text-sm font-medium mb-1">Gender</label>
          <Listbox
            value={selectedGender}
            onChange={(value) => {
              setSelectedGender(value);
              setValue("gender", value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                <span className="block truncate">
                  {selectedGender || "Select Gender"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                {genderOptions.map((gender) => (
                  <Listbox.Option
                    key={gender}
                    value={gender}
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
                          {gender}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <FaCheckCircle className="w-5 h-5" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">
              {errors.gender.message as string}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <label className="block text-sm font-medium mb-1">Religion</label>
          <Listbox
            value={selectedReligion}
            onChange={(value) => {
              setSelectedReligion(value);
              setValue("religion", value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                <span className="block truncate">
                  {selectedReligion || "Select Religion"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <div className="relative">
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60 bottom-full mb-1">
                  {religionOptions.map((religion) => (
                    <Listbox.Option
                      key={religion}
                      value={religion}
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
                            {religion}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <FaCheckCircle className="w-5 h-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </div>
          </Listbox>
          {errors.religion && (
            <p className="text-red-500 text-xs mt-1">
              {errors.religion.message as string}
            </p>
          )}
        </motion.div>
      </div>

      {/* <div className="flex gap-4 my-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="w-1/2"
        >
          
        </motion.div>
      </div> */}
    </motion.div>
  );
};

export default PersonalInfoStep;
