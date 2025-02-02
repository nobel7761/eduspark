"use client";

import { useState, useEffect } from "react";
import AddClassDialog from "./AddClassDialog";
import AddSubjectDialog from "./AddSubjectDialog";
import PageLoader from "@/components/shared/PageLoader";

interface Subject {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
  subjects: Subject[];
}

const AllClassComponent: React.FC = () => {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleClassCreated = (newClass: Class) => {
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/classes`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <>
      <div className="p-4 rounded-md bg-primary text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Classe Details</h2>

          <div className="flex gap-4">
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Subject
            </button>
            <button
              onClick={() => setIsAddClassOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Class
            </button>
          </div>
        </div>

        <AddClassDialog
          isOpen={isAddClassOpen}
          onClose={() => setIsAddClassOpen(false)}
          onClassCreated={handleClassCreated}
        />
        <AddSubjectDialog
          isOpen={isAddSubjectOpen}
          onClose={() => setIsAddSubjectOpen(false)}
        />
      </div>

      {/* Class List */}
      <PageLoader loading={loading}>
        <>
          {error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="p-4 rounded-md bg-primary text-white mt-6 mb-3">
                <h2 className="text-lg font-semibold">All Classes</h2>
              </div>
              {classes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No Classes Found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((classItem) => (
                    <div
                      key={classItem._id}
                      className="bg-primary rounded-lg p-6 text-white shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        {classItem.name}
                      </h3>

                      {/* Subjects Card */}
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex flex-wrap gap-2">
                          {classItem.subjects.map((subject) => (
                            <span
                              key={subject._id}
                              className="px-3 py-1 bg-primary rounded text-sm font-medium"
                            >
                              {subject.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      </PageLoader>
    </>
  );
};

export default AllClassComponent;
