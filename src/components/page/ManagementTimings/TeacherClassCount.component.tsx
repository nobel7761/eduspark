"use client";

import { useState, useEffect, useCallback } from "react";
import SuccessPopup from "@/components/UI/SuccessPopup";
import AddClassCountDialog from "./AddClassCountDialog";
import { toast } from "react-toastify";
import PageLoader from "@/components/shared/PageLoader";
import { IEmployee } from "@/types/employee";
import RunningMonthClassCount from "./RunningMonthClassCount.component";
import { useRouter } from "next/navigation";

const TeacherClassCountComponent = () => {
  // const [isRegularTimingOpen, setIsRegularTimingOpen] = useState(false);
  const [isClassCountOpen, setIsClassCountOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    message: "",
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classBasedTeachers, setClassBasedTeachers] = useState<IEmployee[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { push } = useRouter();

  // Fetch class-based teachers
  const fetchClassBasedTeachers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employees/class-based-teachers`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch class-based teachers");
      }
      const data = await response.json();
      setClassBasedTeachers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch class-based teachers:", error);
      setError("Failed to load teachers");
      toast.error("Failed to load teachers");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassBasedTeachers();
  }, []);

  // Add this to get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="p-4 rounded-md bg-primary text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Teachers Class Count</h2>

          <div className="flex items-center gap-x-4">
            <button
              onClick={() => push("/teacher-class-count/records")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Records
            </button>
            <button
              onClick={() => setIsClassCountOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Class Count
            </button>
          </div>
        </div>

        {/* <AddRegularTimingDialog
          isOpen={isRegularTimingOpen}
          onClose={() => setIsRegularTimingOpen(false)}
          onSuccess={fetchTimings}
        /> */}

        <AddClassCountDialog
          isOpen={isClassCountOpen}
          onClose={() => setIsClassCountOpen(false)}
          classBasedTeachers={classBasedTeachers}
          onSubmitSuccess={refreshData}
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
            {/* <div className="p-4 rounded-md bg-primary my-4">
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
            </div> */}

            {/* class count */}
            <div className="p-4 rounded-t-md bg-primary mt-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-white text-center uppercase">
                Class Count of {currentMonth}
              </h3>
            </div>

            {/* show all the class count records for this month */}
            <div>
              <RunningMonthClassCount key={refreshTrigger} />
            </div>
          </>
        )}
      </PageLoader>
    </>
  );
};

export default TeacherClassCountComponent;
