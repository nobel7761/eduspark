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
      className="p-4 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-3">Parents Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-y-8">
        {/* Father's Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="border border-white p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-3">
            Father&apos;s Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Name
              </label>
              <input
                type="text"
                {...register("father.name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
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
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("father.phone")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
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
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-1">
                Father&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("father.occupation")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Mother's Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="border border-white p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-3">
            Mother&apos;s Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                {...register("mother.name")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
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
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Phone
              </label>
              <input
                type="tel"
                {...register("mother.phone")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
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
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-1">
                Mother&apos;s Occupation
              </label>
              <input
                type="text"
                {...register("mother.occupation")}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParentsInfoStep;
