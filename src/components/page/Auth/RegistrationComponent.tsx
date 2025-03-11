"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface RegistrationComponentProps {
  onLoginClick: () => void;
}

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: yup
    .string()
    .matches(
      /^\+88[0-9]{11}$/,
      "Phone number must start with +88 followed by 11 digits"
    )
    .required("Phone number is required"),
});

const RegistrationComponent = ({
  onLoginClick,
}: RegistrationComponentProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "+88",
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to register");
        return;
      }

      login(data.accessToken, data.refreshToken);
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error as string);
    }
  };

  // Add animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full md:w-1/2 p-8 bg-[#1B2028]/95"
    >
      <div className="max-w-md mx-auto">
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-semibold text-white mb-16 text-center"
        >
          Create your account
        </motion.h1>

        {error && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <div className="text-red-500">{error}</div>
          </motion.div>
        )}

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-white mb-2">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white mb-2">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
            />
            {errors.phone && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.phone.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white flex items-center justify-center gap-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-white">
            Already have an account?{" "}
            <motion.button
              onClick={onLoginClick}
              className="text-blue-500 hover:text-blue-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login here
            </motion.button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegistrationComponent;
