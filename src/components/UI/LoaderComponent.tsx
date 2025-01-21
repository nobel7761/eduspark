"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "/public/images/eduspark-logo-nobg.png";

const LoaderComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1, 0],
            }}
            transition={{
              duration: 3,
              times: [0, 0.4, 0.6, 1],
              ease: "easeInOut",
            }}
          >
            <Image src={logo} alt="EduSpark" width={200} height={200} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderComponent;
