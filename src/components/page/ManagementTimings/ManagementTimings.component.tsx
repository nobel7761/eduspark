"use client";

import { useState, useEffect } from "react";
import SuccessPopup from "@/components/UI/SuccessPopup";
import AddRegularTimingDialog from "./AddRegularTimingDialog";
import AddClassCountDialog from "./AddClassCountDialog";
import { IDirector } from "@/types/directors";
import { toast } from "react-toastify";
import PageLoader from "@/components/shared/PageLoader";

interface DirectorTiming {
  directorName: string;
  classCount: number;
  totalHours: number;
}

const ManagementTimingsComponent = () => {
  const [isRegularTimingOpen, setIsRegularTimingOpen] = useState(false);
  const [isClassCountOpen, setIsClassCountOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    message: "",
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update directors fetch with loading and error states
  const [allDirectors, setAllDirectors] = useState<IDirector[]>([]);
  useEffect(() => {
    const fetchDirectors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/directors`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch directors");
        }
        const data = await response.json();
        setAllDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
        setError("Failed to load directors");
        toast.error("Failed to load directors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  const [directorTimings, setDirectorTimings] = useState<DirectorTiming[]>([]);

  const fetchTimings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/management-regular-timing/current-month`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch timings");
      }
      const data = await response.json();
      setDirectorTimings(data);
    } catch (error) {
      console.error("Failed to fetch director timings:", error);
      setError("Failed to load timings");
      toast.error("Failed to load timings");
    }
  };

  useEffect(() => {
    fetchTimings();
  }, []);

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
          onSuccess={fetchTimings}
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

      <PageLoader loading={isLoading}>
        {error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md my-4">
            {error}
          </div>
        ) : (
          <>
            {/* hours count */}
            <div className="p-4 rounded-md bg-primary my-4">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Hours Count of {currentMonth}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allDirectors.map((director) => {
                  const directorData = directorTimings.find(
                    (t) => t.directorName === director.name
                  );
                  return (
                    <div
                      key={director._id}
                      className="bg-white text-gray-800 p-4 rounded-lg shadow-md"
                    >
                      <h4 className="font-medium text-lg mb-2">
                        {director.name}
                      </h4>
                      <p className="text-4xl font-bold text-blue-600 my-2">
                        {directorData?.totalHours || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estimated Minimum Hours: 30
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </PageLoader>
    </>
  );
};

export default ManagementTimingsComponent;
