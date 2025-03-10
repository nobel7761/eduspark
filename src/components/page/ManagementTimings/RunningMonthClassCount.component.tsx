import React, { useState, useEffect, useCallback } from "react";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { ColumnFiltersState } from "@tanstack/react-table";

interface ClassCount {
  "3-8": number;
  "9-10": number;
  "11-12": number;
  total?: number;
}

interface ClassCountDetail {
  date: string;
  classCount: ClassCount;
}

interface EmployeeClassCount {
  employeeId: string;
  employeeName: string;
  shortName: string;
  classCountDetails: ClassCountDetail[];
  totalClassTakenThisMonthSoFar: ClassCount;
  totalIncomeThisMonthSoFar: ClassCount;
}

interface RunningMonthClassCountProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const RunningMonthClassCount: React.FC<RunningMonthClassCountProps> = ({
  columnFilters,
  setColumnFilters,
}) => {
  const [data, setData] = useState<EmployeeClassCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get filter values
  const monthFilter = columnFilters.find((f) => f.id === "month")
    ?.value as string;
  const yearFilter = columnFilters.find((f) => f.id === "year")
    ?.value as string;

  // Get all dates based on selected month and year
  const getMonthDates = useCallback(() => {
    const year = parseInt(yearFilter);
    const month = parseInt(monthFilter);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i + 1
      ).padStart(2, "0")}`;
    });
  }, [monthFilter, yearFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const month = (parseInt(monthFilter) + 1).toString().padStart(2, "0");
        const year = yearFilter;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/monthly-class-count/filter?month=${month}&year=${year}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch class count data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching class count data:", error);
        setError("Failed to load class count data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [monthFilter, yearFilter]);

  // Get unique years for filter (current year and past 2 years)
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2].sort(
      (a, b) => b - a
    );
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  // Add check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center text-gray-500 text-lg">
          No data found for this month
        </div>
      </div>
    );
  }

  const allDates = getMonthDates();

  return (
    <div>
      <div className="overflow-x-auto w-full rounded-b-lg shadow-lg bg-primary">
        <div className="flex items-center gap-x-4 p-4 mb-4">
          {/* Month Dropdown */}
          <div className="w-40">
            <Listbox
              value={monthFilter}
              onChange={(value) => {
                const newFilters = columnFilters.map((f) =>
                  f.id === "month" ? { ...f, value } : f
                );
                setColumnFilters(newFilters);
              }}
              disabled={loading}
            >
              <div className="relative">
                <Listbox.Button
                  className={`relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="block truncate">
                    {new Date(2024, parseInt(monthFilter)).toLocaleString(
                      "default",
                      {
                        month: "long",
                      }
                    )}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Listbox.Option
                      key={i}
                      value={i.toString()}
                      className={({ active }) =>
                        `${active ? "bg-primary text-white" : "text-white"}
                      cursor-pointer select-none relative py-2 pl-10 pr-4`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {new Date(2024, i).toLocaleString("default", {
                              month: "long",
                            })}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <FaCheckCircle className="w-5 h-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Year Dropdown */}
          <div className="w-32">
            <Listbox
              value={yearFilter}
              onChange={(value) => {
                const newFilters = columnFilters.map((f) =>
                  f.id === "year" ? { ...f, value } : f
                );
                setColumnFilters(newFilters);
              }}
            >
              <div className="relative">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
                  <span className="block truncate">{yearFilter}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                  {years.map((year) => (
                    <Listbox.Option
                      key={year}
                      value={year.toString()}
                      className={({ active }) =>
                        `${active ? "bg-primary text-white" : "text-white"}
                      cursor-pointer select-none relative py-2 pl-10 pr-4`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {year}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <FaCheckCircle className="w-5 h-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-primary text-white text-sm">
              <th className="p-4 border-b border-r border-gray-200">Date</th>
              {data.map((employee, index) => (
                <th
                  key={index}
                  className={`p-4 border-b border-gray-200 text-center ${
                    index < data.length - 1 ? "border-r" : ""
                  }`}
                  colSpan={3}
                >
                  {employee.shortName}
                </th>
              ))}
            </tr>
            <tr className="bg-primary/90 text-white">
              <th className="p-3 border-b border-r border-gray-200"></th>
              {data.map((employee, index) => (
                <React.Fragment key={`${index}-ranges`}>
                  <th className="p-3 border-b border-gray-200 text-sm font-medium">
                    3-8
                  </th>
                  <th className="p-3 border-b border-gray-200 text-sm font-medium">
                    9-10
                  </th>
                  <th
                    className={`p-3 border-b border-gray-200 text-sm font-medium ${
                      index < data.length - 1 ? "border-r" : ""
                    }`}
                  >
                    11-12
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="bg-primary text-white">
            {allDates.map((date, index) => (
              <tr key={index}>
                <td className="p-4 border-b border-r border-gray-200 font-medium">
                  {new Date(date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                {data.map((employee, teacherIndex, index) => {
                  const dayData = employee.classCountDetails.find(
                    (detail) => detail.date.split("T")[0] === date
                  );
                  const classCount = dayData?.classCount || {
                    "3-8": 0,
                    "9-10": 0,
                    "11-12": 0,
                  };

                  return (
                    <React.Fragment
                      key={`${index}-${employee.employeeId}-${date}`}
                    >
                      <td className="p-4 border-b border-gray-200 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full ${
                            classCount["3-8"] > 0
                              ? "bg-green-600 text-white"
                              : "bg-red-500/10"
                          }`}
                        >
                          {classCount["3-8"] > 0 ? classCount["3-8"] : "-"}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full ${
                            classCount["9-10"] > 0
                              ? "bg-green-600 text-white"
                              : "bg-red-500/10"
                          }`}
                        >
                          {classCount["9-10"] > 0 ? classCount["9-10"] : "-"}
                        </span>
                      </td>
                      <td
                        className={`p-4 border-b border-gray-200 text-center ${
                          teacherIndex < data.length - 1 ? "border-r" : ""
                        }`}
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full ${
                            classCount["11-12"] > 0
                              ? "bg-green-600 text-white"
                              : "bg-red-500/10"
                          }`}
                        >
                          {classCount["11-12"] > 0 ? classCount["11-12"] : "-"}
                        </span>
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}

            {/* Add totals rows */}
            {/* Classes Total Row */}
            <tr className="bg-primary-dark border-t-2 border-white">
              <td className="pl-3 border-r border-gray-200 font-medium text-xs">
                Class Count
              </td>
              {data.map((employee, teacherIndex) => (
                <React.Fragment key={`total-${employee.employeeId}`}>
                  <td className="p-2 border-gray-200 text-center">
                    <span className="text-xs">
                      {employee.totalClassTakenThisMonthSoFar["3-8"]}
                    </span>
                  </td>
                  <td className="p-2 border-gray-200 text-center">
                    <span className="text-xs">
                      {employee.totalClassTakenThisMonthSoFar["9-10"]}
                    </span>
                  </td>
                  <td
                    className={`p-2 border-gray-200 text-center ${
                      teacherIndex < data.length - 1 ? "border-r" : ""
                    }`}
                  >
                    <span className="text-xs">
                      {employee.totalClassTakenThisMonthSoFar["11-12"]}
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Income Total Row */}
            <tr className="bg-primary-dark border-t-2 border-white">
              <td className="pl-3 border-r border-gray-200 font-medium text-xs">
                Income
              </td>
              {data.map((employee, teacherIndex) => (
                <React.Fragment key={`income-${employee.employeeId}`}>
                  <td className="p-2 border-gray-200 text-center">
                    <span className="text-xs">
                      ৳ {employee.totalIncomeThisMonthSoFar["3-8"]}
                    </span>
                  </td>
                  <td className="p-2 border-gray-200 text-center">
                    <span className="text-xs">
                      ৳ {employee.totalIncomeThisMonthSoFar["9-10"]}
                    </span>
                  </td>
                  <td
                    className={`p-2 border-gray-200 text-center ${
                      teacherIndex < data.length - 1 ? "border-r" : ""
                    }`}
                  >
                    <span className="text-xs">
                      ৳ {employee.totalIncomeThisMonthSoFar["11-12"]}
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Final Income Row */}
            <tr className="bg-primary-dark border-t-2 border-white">
              <td className="pl-3 border-r border-gray-200 font-medium text-xs">
                Final Income
              </td>
              {data.map((employee, teacherIndex) => (
                <React.Fragment key={`final-income-${employee.employeeId}`}>
                  <td
                    colSpan={3}
                    className={`p-2 border-gray-200 text-center ${
                      teacherIndex < data.length - 1 ? "border-r" : ""
                    }`}
                  >
                    <span className="text-xs">
                      ৳ {employee.totalIncomeThisMonthSoFar.total}
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunningMonthClassCount;
