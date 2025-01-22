"use client";

import { allStudentsList } from "../../../public/data/students";
import { allTeachersList } from "../../../public/data/teachers";

const DashboardComponent: React.FC = () => {
  const totalStudents = allStudentsList.length;
  const totalTeachers = allTeachersList.length;
  return (
    <div>
      <div className="flex justify-around bg-gray-900 p-6 rounded-md">
        {/* Total Students */}
        <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-lg w-1/4 mx-2 shadow-lg">
          <div
            className={`text-4xl text-green-400 mb-3`}
            aria-label="Total Students"
          >
            👤
          </div>
          <div className="text-2xl font-semibold">{totalStudents}</div>
          <div className="text-sm">Total students</div>
        </div>

        {/* Total Teachers */}
        <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-lg w-1/4 mx-2 shadow-lg">
          <div
            className={`text-4xl text-yellow-400 mb-3`}
            aria-label="Total Teachers"
          >
            👤
          </div>
          <div className="text-2xl font-semibold">{totalTeachers}</div>
          <div className="text-sm">Total teachers</div>
        </div>

        {/* Total Earnings (this month) */}
        <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-lg w-1/4 mx-2 shadow-lg">
          <div
            className={`text-4xl text-purple-400 mb-3`}
            aria-label="Total Earnings"
          >
            💰
          </div>
          <div className="text-2xl font-semibold">100</div>
          <div className="text-sm">Earnings this month</div>
        </div>

        {/* Total Expenses (this month) */}
        <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-lg w-1/4 mx-2 shadow-lg">
          <div
            className={`text-4xl text-red-400 mb-3`}
            aria-label="Total Expenses"
          >
            💸
          </div>
          <div className="text-2xl font-semibold">100</div>
          <div className="text-sm">Expenses this month</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
