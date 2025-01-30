import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const PersonalInfoStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-4 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message as string}
            </p>
          )}
        </motion.div>

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
            <p className="text-red-500 text-sm mt-1">
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
          <select
            {...register("gender", {
              required: "Gender is required",
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">
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
          <select
            {...register("religion", {
              required: "Religion is required",
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          >
            <option value="">Select Religion</option>
            <option value="Islam">Islam</option>
            <option value="Hinduism">Hinduism</option>
            <option value="Christianity">Christianity</option>
            <option value="Buddhism">Buddhism</option>
          </select>
          {errors.religion && (
            <p className="text-red-500 text-sm mt-1">
              {errors.religion.message as string}
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
            <p className="text-red-500 text-sm mt-1">
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="md:col-span-2"
        >
          <label className="block text-sm font-medium mb-2">Photo</label>
          <label className="w-full bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
            <span className="px-4 text-black">Choose file</span>
            <input
              type="file"
              accept="image/*"
              {...register("photo", { required: true })}
              className="hidden"
            />
          </label>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
