"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "/public/images/eduspark-logo-nobg.png";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserType } from "@/enums/user-type.enum";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationComponent from "./RegistrationComponent";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  user_type?: UserType;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        setError(data.message || "Failed to login");
        return;
      }

      // Check for both access_token and accessToken in the response
      const accessToken = data.access_token || data.accessToken;
      const refreshToken = data.refresh_token || data.refreshToken;

      if (!accessToken) {
        console.error("No access token in response:", data);
        setError("Invalid login response - No access token found");
        return;
      }

      // Store tokens directly before using AuthContext
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Set cookies with proper options
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      // Use the login function from AuthContext
      login(accessToken, refreshToken);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <div className="flex flex-col md:flex-row">
          {!showRegistration ? (
            <>
              {/* Right Side - Feature Showcase - Now on top for mobile */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center order-1 md:order-2"
              >
                <div className="max-w-md w-full text-center">
                  <div className="flex justify-center items-center mb-4 md:mb-8">
                    <Image
                      src={logo}
                      alt="EduSpark"
                      width={300}
                      height={300}
                      className="w-auto h-auto"
                      priority
                    />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-2 md:mb-4">
                    EduSpark
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-8">
                    EduSpark is a platform that helps students learn and grow.
                  </p>
                </div>
              </motion.div>

              {/* Left Side - Login Form - Now below for mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full md:w-1/2 p-4 md:p-8 bg-[#1B2028]/95 order-2 md:order-1"
              >
                <div className="max-w-md mx-auto">
                  <h1 className="text-2xl md:text-3xl font-semibold text-white my-8 md:mb-16 text-center">
                    Let&apos;s get you signed in
                  </h1>

                  {/* Social Login Buttons */}
                  {/* <div className="flex gap-4 mb-8">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-transparent text-white border border-gray-600 rounded-lg hover:bg-gray-700">
                        <FaGoogle /> Google
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-transparent text-white border border-gray-600 rounded-lg hover:bg-gray-700">
                        <FaFacebook /> Facebook
                      </button>
                    </div> */}

                  {/* <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1B2028] text-gray-400">
                          or Sign in with
                        </span>
                      </div>
                    </div> */}

                  {error && (
                    <div
                      className="flex justify-center items-center p-3 md:p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                      role="alert"
                    >
                      <svg
                        className="shrink-0 inline w-4 h-4 me-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Info</span>
                      <div className="text-red-500 text-sm md:text-base">
                        {error}
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 md:space-y-6"
                  >
                    <div>
                      <label className="block text-white mb-2 text-sm md:text-base">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-sm md:text-base"
                      />
                      {errors.email && (
                        <p className="mt-1 text-red-500 text-xs md:text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-white text-sm md:text-base">
                          Password
                        </label>
                        {/* <Link
                            href="/forgot-password"
                            className="text-white hover:text-primary/80"
                          >
                            Forgot Password?
                          </Link> */}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-sm md:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg md:text-xl"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-red-500 text-xs md:text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-blue-600 text-white flex items-center justify-center gap-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
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
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  {/* <div className="text-center mt-4 md:mt-6">
                    <p className="text-white text-sm md:text-base">
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => setShowRegistration(true)}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        Register here
                      </button>
                    </p>
                  </div> */}
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Left Side - Feature Showcase - Now on top for mobile */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center order-1 md:order-2"
              >
                <div className="max-w-md w-full text-center">
                  <div className="flex justify-center items-center mb-4 md:mb-8">
                    <Image
                      src={logo}
                      alt="EduSpark"
                      width={300}
                      height={300}
                      className="w-auto h-auto"
                      priority
                    />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-2 md:mb-4">
                    EduSpark
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-8">
                    EduSpark is a platform that helps students learn and grow.
                  </p>
                </div>
              </motion.div>

              {/* Right Side - Registration Form */}
              <RegistrationComponent
                onLoginClick={() => setShowRegistration(false)}
              />
            </>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default LoginComponent;
