"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  // LineChart,
  // Line,
} from "recharts";

// interface CountResponse {
//   count: number;
// }

interface GenderCount {
  male: number;
  female: number;
}

interface ClassCount {
  [key: string]: number;
}

const DashboardComponent: React.FC = () => {
  // State for all our data
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    monthlyEarnings: 0,
    totalEarnings: 0,
    monthlyExpenses: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    totalProfit: 0,
    totalFundAmount: 0,
  });
  const [genderData, setGenderData] = useState<GenderCount>({
    male: 0,
    female: 0,
  });
  const [classData, setClassData] = useState<ClassCount>({});
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Get current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/earnings/get-dashboard-items`
        );
        const data = await response.json();

        setStats({
          totalStudents: data.totalStudents,
          totalTeachers: data.totalEmployees,
          monthlyEarnings: data.thisMonthEarning,
          totalEarnings: data.totalEarning,
          monthlyExpenses: data.thisMonthExpense,
          totalExpenses: data.totalExpense,
          totalInvestments: data.totalInvestment,
          totalProfit: data.totalProfit,
          totalFundAmount: data.totalFundAmount,
        });
        setGenderData(data.totalStudentsByGender);
        setClassData(data.totalStudentsByClass);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for charts
  const genderChartData = [
    { name: "Male", value: genderData.male },
    { name: "Female", value: genderData.female },
  ];

  const classChartData = Object.entries(classData).map(
    ([className, count]) => ({
      name: className,
      students: count,
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Financial Overview - Moved to top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">Total Earnings</h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.totalEarnings}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">Total Expenses</h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.totalExpenses}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">
            Total Investments
          </h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.totalInvestments}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`bg-gradient-to-r rounded-lg p-4 md:p-6 text-white ${
            stats.totalProfit >= 0
              ? "from-emerald-500 to-emerald-600"
              : "from-red-500 to-red-600"
          }`}
        >
          <h3 className="text-base md:text-lg font-semibold -mb-2">
            Total Profit
          </h3>
          <span className="text-xs italic">Earnings - Expenses</span>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.totalProfit}
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">
            Earnings ({currentMonth})
          </h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.monthlyEarnings}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">
            Expenses ({currentMonth})
          </h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.monthlyExpenses}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">Fund Raised</h3>
          <p className="text-2xl md:text-3xl font-bold">
            ৳ {stats.totalFundAmount}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">Total Students</h3>
          <p className="text-2xl md:text-3xl font-bold">
            {stats.totalStudents}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 md:p-6 text-white"
        >
          <h3 className="text-base md:text-lg font-semibold">Total Teachers</h3>
          <p className="text-2xl md:text-3xl font-bold">
            {stats.totalTeachers}
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">
            Student Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {genderChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Class Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Students by Class</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="students"
                fill="#8884d8"
                animationBegin={0}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardComponent;
