"use client";

import { useState } from "react";
import SuccessPopup from "@/components/UI/SuccessPopup";
import AddRegularTimingDialog from "./AddRegularTimingDialog";
import AddClassCountDialog from "./AddClassCountDialog";
import { DIRECTORS } from "@/constants/directors.constants";

const ManagementTimingsComponent = () => {
  const [isRegularTimingOpen, setIsRegularTimingOpen] = useState(false);
  const [isClassCountOpen, setIsClassCountOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    message: "",
  });

  // Add this to get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <>
      <div className="p-4 rounded-md bg-primary text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Management Timings</h2>

          <div className="flex items-center gap-x-4">
            <button
              onClick={() => setIsRegularTimingOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Regular Timing
            </button>
            <button
              onClick={() => setIsClassCountOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Class Count
            </button>
          </div>
        </div>

        <AddRegularTimingDialog
          isOpen={isRegularTimingOpen}
          onClose={() => setIsRegularTimingOpen(false)}
        />

        <AddClassCountDialog
          isOpen={isClassCountOpen}
          onClose={() => setIsClassCountOpen(false)}
        />

        <SuccessPopup
          isOpen={successPopup.isOpen}
          onClose={() => setSuccessPopup({ isOpen: false, message: "" })}
          message={successPopup.message}
        />
      </div>

      {/* class count */}
      <div className="p-4 rounded-md bg-primary my-4">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Class Count of {currentMonth}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIRECTORS.map((director, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 p-4 rounded-lg shadow-md"
            >
              <h4 className="font-medium text-lg mb-2">{director}</h4>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">Classes this month</p>
            </div>
          ))}
        </div>
      </div>

      {/* hours count */}
      <div className="p-4 rounded-md bg-primary my-4">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Hours Count of {currentMonth}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIRECTORS.map((director, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 p-4 rounded-lg shadow-md"
            >
              <h4 className="font-medium text-lg mb-2">{director}</h4>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">
                Estimated Minimum Hours: 30
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagementTimingsComponent;
