import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

interface ReferralFormData {
  referredBy: {
    name: string;
    phone: string;
  };
  payment: {
    admissionFee: number;
    formFee: number;
    monthlyFee: number;
    packageFee: number;
    referrerFee: number;
    comments?: string;
  };
}

const ReferralInfoStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReferralFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-lg"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
        Referral Information
      </h2>

      {/* Referral Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-3 md:p-4 rounded-lg bg-gray-900/50 border border-white mb-4 md:mb-6"
      >
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
          Referral Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-1">
              Referred By Name
            </label>
            <input
              type="text"
              {...register("referredBy.name")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.referredBy?.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.referredBy.name.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-1">
              Referred By Phone
            </label>
            <input
              type="tel"
              {...register("referredBy.phone")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.referredBy?.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.referredBy.phone.message as string}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="p-3 md:p-4 rounded-lg bg-gray-900/50 border border-white"
      >
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
          Payment Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">
              Admission Fee
            </label>
            <input
              type="number"
              {...register("payment.admissionFee")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.payment?.admissionFee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.admissionFee.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1">Form Fee</label>
            <input
              type="number"
              {...register("payment.formFee")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.payment?.formFee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.formFee.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <label className="block text-sm font-medium mb-1">
              Monthly Fee
            </label>
            <input
              type="number"
              {...register("payment.monthlyFee")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.payment?.monthlyFee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.monthlyFee.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <label className="block text-sm font-medium mb-1">
              Package Fee
            </label>
            <input
              type="number"
              {...register("payment.packageFee")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.payment?.packageFee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.packageFee.message as string}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <label className="block text-sm font-medium mb-1">
              Referrer Fee
            </label>
            <input
              type="number"
              {...register("payment.referrerFee")}
              className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none"
            />
            {errors.payment?.referrerFee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payment.referrerFee.message as string}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="mt-4"
        >
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea
            {...register("payment.comments")}
            className="w-full p-2 text-sm md:text-base rounded bg-gray-800 focus:outline-none min-h-[100px]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ReferralInfoStep;
