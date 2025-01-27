"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "/public/images/eduspark-logo-nobg.png";
import useApi from "@/hooks/use-api.hook";
import useAuth from "@/hooks/use-auth.hook";
import PageLoader from "@/components/shared/PageLoader";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  // phone?: string;
  // email?: string;
  // name?: string;
  // userId?: string;
  // tfaId?: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginComponent = () => {
  const { login } = useAuth();
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

  const [showPassword, setShowPassword] = useState(false);

  const { data, error, callApi } = useApi<LoginResponse, LoginFormValues>({
    url: "/auth/login",
    method: "POST",
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { email, ...rest } = values;
    console.log(email, rest);
    await callApi({ email: email.trim(), ...rest });
  };

  console.log(data, error);

  useEffect(() => {
    if (data?.access_token) {
      // setLoading(true);
      login(data.access_token);
    }
  }, [data]);

  return (
    <PageLoader loading={isSubmitting}>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 bg-[#1B2028]/95">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-semibold text-white mb-16 text-center">
                Let&apos;s get you signed in
              </h1>

              {/* Social Login Buttons */}
              <div className="flex gap-4 mb-8">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-transparent text-white border border-gray-600 rounded-lg hover:bg-gray-700">
                  <FaGoogle /> Google
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-transparent text-white border border-gray-600 rounded-lg hover:bg-gray-700">
                  <FaFacebook /> Facebook
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1B2028] text-gray-400">
                    or Sign in with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
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
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-white">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-white hover:text-primary/80"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full px-4 py-3  border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
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
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">
                    {error.message || "An error occurred during login"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Feature Showcase */}
          <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
            <div className="max-w-md text-center">
              <Image
                src={logo}
                alt="EduSpark"
                width={400}
                height={400}
                className="mb-8"
              />
              <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
                EduSpark
              </h2>
              <p className="text-gray-600 mb-8">
                EduSpark is a platform that helps students learn and grow.
              </p>
              <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  );
};

export default LoginComponent;
