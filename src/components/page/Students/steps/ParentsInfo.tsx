"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

interface ParentsFormData {
  father?: {
    name: string;
    phone: string;
    occupation: string;
  };
  mother?: {
    name: string;
    phone: string;
    occupation: string;
  };
}

const ParentsInfoStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ParentsFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-lg"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
        Parents Information
      </h2>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Father's Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="border border-white p-3 md:p-4 rounded-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Father&apos;s Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Name
              </label>
              <input
                type="text"
                {...register("father.name")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
              {errors.father?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.father.name.message as string}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("father.phone")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
              {errors.father?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.father.phone.message as string}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="sm:col-span-2"
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("father.occupation")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Mother's Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="border border-white p-3 md:p-4 rounded-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Mother&apos;s Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                {...register("mother.name")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
              {errors.mother?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mother.name.message as string}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("mother.phone")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
              {errors.mother?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mother.phone.message as string}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="sm:col-span-2"
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("mother.occupation")}
                className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParentsInfoStep;
