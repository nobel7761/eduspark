import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const ReferralInfoStep = () => {
  const { register } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-4 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-3">Referral Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-sm font-medium mb-1">
            Referred By Name
          </label>
          <input
            type="text"
            {...register("referredBy.name", { required: true })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-1">
            Referred By Phone
          </label>
          <input
            type="tel"
            {...register("referredBy.phone", { required: true })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReferralInfoStep;
