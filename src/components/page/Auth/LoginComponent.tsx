"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import logo from "/public/images/eduspark-logo-nobg.png";

const LoginComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically make an API call to validate credentials
      // For now, we'll just simulate a successful login
      console.log("Form submitted:", formData);

      // Redirect to dashboard after successful login
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (show error message, etc.)
    }
  };

  return (
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#1B2028] border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-white"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#1B2028] border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-white"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="rounded bg-[#1B2028] border-gray-600 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-gray-300">
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
  );
};

export default LoginComponent;
