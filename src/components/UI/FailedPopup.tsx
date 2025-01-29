import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface FailedPopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

const FailedPopup: React.FC<FailedPopupProps> = ({
  isOpen,
  message,
  onClose,
  autoCloseDelay = 2000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-lg p-6 shadow-xl relative z-10 max-w-sm w-full mx-4"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <svg className="w-16 h-16" viewBox="0 0 50 50">
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                d="M16 16 L34 34 M34 16 L16 34"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800 text-center">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FailedPopup;
