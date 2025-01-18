"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NotFoundComponent = () => {
  const { push } = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      push("/");
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [push]);

  const handleGoHome = () => {
    push("/");
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-2xl mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <p className="text-gray-600 mb-6">
        You will be redirected to the homepage in {secondsLeft} second
        {secondsLeft !== 1 && "s"}.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundComponent;
