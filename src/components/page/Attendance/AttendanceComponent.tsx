"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Menu } from "@headlessui/react";
import { MdViewColumn } from "react-icons/md";
import { toast } from "react-toastify";
import AddAttendanceDialog from "@/components/Dialogs/AddAttendanceDialog";
import EditAttendanceDialog from "@/components/Dialogs/EditAttendanceDialog";
import { EmployeeType } from "@/enums/employees.enum";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { AttendanceStatus } from "@/enums/attendance.enum";

export interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeType: EmployeeType;
  };
  date: string;
  status: AttendanceStatus;
  comments?: string;
}

interface TableRecord {
  date: string;
  [key: string]: string | AttendanceStatus | null;
}

const DEFAULT_VISIBLE_COLUMNS = {
  date: true,
  month: false,
  year: false,
  status: false,
  employeeId: false,
};

const AttendanceComponent = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "month",
      value: new Date().getMonth().toString(),
    },
    {
      id: "year",
      value: new Date().getFullYear().toString(),
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const columnHelper = createColumnHelper<TableRecord>();

  const columns = React.useMemo(() => {
    const uniqueEmployees = Array.from(
      new Set(
        records.map(
          (record) =>
            `${record.employeeId.firstName} ${record.employeeId.lastName}`
        )
      )
    ).sort();

    const baseColumns = [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      }),
    ];

    uniqueEmployees.forEach((employeeName) => {
      baseColumns.push(
        columnHelper.accessor(employeeName, {
          header: employeeName,
          cell: (info) => {
            const status = info.getValue();
            if (!status) return <span className="text-gray-500">-</span>;

            return (
              <div className="text-center font-bold flex items-center justify-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs inline-block w-20 ${
                    {
                      [AttendanceStatus.PRESENT]: "bg-[#28a745] text-white",
                      [AttendanceStatus.ABSENT]: "bg-red-600 text-white",
                      [AttendanceStatus.LATE]: "bg-yellow-300 text-black",
                      [AttendanceStatus.OFF_DAY]: "bg-gray-600 text-white",
                      [AttendanceStatus.DEMO]: "bg-purple-600 text-white",
                      [AttendanceStatus.HALF_DAY]: "bg-blue-600 text-white",
                      [AttendanceStatus.ON_LEAVE]: "bg-pink-600 text-white",
                    }[status as AttendanceStatus]
                  }`}
                >
                  {String(status).replace("_", " ")}
                </span>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => {
                    const record = records.find(
                      (r) =>
                        r.employeeId.firstName + " " + r.employeeId.lastName ===
                          employeeName && r.date === info.row.original.date
                    );
                    if (record) {
                      setSelectedRecord(record);
                      setIsEditModalOpen(true);
                    }
                  }}
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>
            );
          },
        })
      );
    });

    return [
      ...baseColumns,
      columnHelper.accessor((row) => new Date(row.date).getMonth(), {
        id: "month",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const month = new Date(row.getValue("date")).getMonth();
          return month === parseInt(filterValue as string);
        },
      }),
      columnHelper.accessor((row) => new Date(row.date).getFullYear(), {
        id: "year",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const year = new Date(row.getValue("date")).getFullYear();
          return year === parseInt(filterValue as string);
        },
      }),
      columnHelper.accessor("status", {
        id: "status",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.getValue(columnId) === filterValue;
        },
      }),
    ];
  }, [columnHelper, records]);

  // Transform the records into the format needed for the table
  const tableData = React.useMemo(() => {
    const data: TableRecord[] = [];

    // Group records by date
    const recordsByDate = records.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = {} as TableRecord;
      }
      const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`;
      acc[date][employeeName] = record.status;
      acc[date].date = date;
      return acc;
    }, {} as Record<string, TableRecord>);

    // Convert to array format
    Object.values(recordsByDate).forEach((dateRecord) => {
      data.push(dateRecord);
    });

    return data;
  }, [records]);

  const table = useReactTable<TableRecord>({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Get current month and year
        const now = new Date();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // Convert to 01-12 format
        const currentYear = now.getFullYear().toString();

        // Get filter values from table state
        const monthFilter = table.getColumn("month")?.getFilterValue();
        const yearFilter = table.getColumn("year")?.getFilterValue();
        const statusFilter = table.getColumn("status")?.getFilterValue();
        const employeeFilter = table.getColumn("employeeId")?.getFilterValue();

        // Build query parameters
        const params = new URLSearchParams();

        // Handle month filter - convert from index (0-11) to month number (1-12)
        if (monthFilter !== undefined && monthFilter !== "") {
          const monthNumber = (Number(monthFilter) + 1)
            .toString()
            .padStart(2, "0");
          params.append("month", monthNumber);
        } else {
          params.append("month", currentMonth);
        }

        // Handle year filter
        if (yearFilter) {
          params.append("year", yearFilter.toString());
        } else {
          params.append("year", currentYear);
        }

        // Handle status filter - convert enum value to match API expected format
        if (statusFilter) {
          // Convert ABSENT to Absent, PRESENT to Present, etc.
          const formattedStatus =
            statusFilter.toString().charAt(0).toUpperCase() +
            statusFilter.toString().slice(1).toLowerCase().replace("_", " ");
          params.append("status", formattedStatus);
        }

        // Handle employee filter
        if (employeeFilter) {
          params.append("employeeId", employeeFilter.toString());
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/attendance/filter?${params}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("Failed to load attendance records");
        toast.error("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [
    refreshTrigger,
    table.getColumn("month")?.getFilterValue(),
    table.getColumn("year")?.getFilterValue(),
    table.getColumn("status")?.getFilterValue(),
    table.getColumn("employeeId")?.getFilterValue(),
  ]);

  // Get unique values for filters
  const uniqueValues = React.useMemo(() => {
    if (!records) return { employees: [], months: [], years: [] };

    // Get current year
    const currentYear = new Date().getFullYear();

    // Get years from records and add current year if not present
    const yearsFromRecords = Array.from(
      new Set(records.map((record) => new Date(record.date).getFullYear()))
    );

    // Ensure we include a range of years including current year and past years
    const allYears = new Set([
      ...yearsFromRecords,
      currentYear,
      currentYear - 1,
      currentYear - 2,
    ]);

    return {
      employees: Array.from(
        new Set(
          records.map(
            (record) =>
              `${record.employeeId.firstName} ${record.employeeId.lastName}`
          )
        )
      ).sort(),
      months: Array.from(
        new Set(records.map((record) => new Date(record.date).getMonth()))
      ).sort((a, b) => a - b),
      years: Array.from(allYears).sort((a, b) => b - a), // Sort years in descending order
    };
  }, [records]);

  const refreshData = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Attendance Records</h1>
        </div>

        <div className="flex items-center gap-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>Add Attendance</span>
          </button>

          {/* Column Visibility */}
          <Menu as="div" className="relative">
            <Menu.Button className="text-3xl text-gray-400 hover:text-white">
              <MdViewColumn />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-2">
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === "month" || column.id === "year")
                    return null;

                  return (
                    <div key={column.id} className="flex items-center gap-x-2">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
                      />
                      <label className="text-sm">
                        {column.id === "employeeName"
                          ? "Employee Name"
                          : column.id === "isPresentOnTime"
                          ? "Late Join"
                          : column.id === "employeeType"
                          ? "Employee Type"
                          : column.id.charAt(0).toUpperCase() +
                            column.id.slice(1)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-x-4 mb-4">
        {/* Month Dropdown */}
        <div className="w-40">
          <Listbox
            value={(table.getColumn("month")?.getFilterValue() as string) ?? ""}
            onChange={(value) => {
              if (!loading) {
                table.getColumn("month")?.setFilterValue(value);
              }
            }}
            disabled={loading}
          >
            <div className="relative">
              <Listbox.Button
                className={`relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                <span className="block truncate">
                  {table.getColumn("month")?.getFilterValue() !== undefined &&
                  table.getColumn("month")?.getFilterValue() !== ""
                    ? new Date(
                        2024,
                        parseInt(
                          table.getColumn("month")?.getFilterValue() as string
                        )
                      ).toLocaleString("default", { month: "long" })
                    : new Date().toLocaleString("default", { month: "long" })}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <Listbox.Option
                    key={month}
                    value={month}
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
                          {new Date(2024, month).toLocaleString("default", {
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
            value={(table.getColumn("year")?.getFilterValue() as string) ?? ""}
            onChange={(value) => table.getColumn("year")?.setFilterValue(value)}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-700 rounded cursor-pointer focus:outline-none text-white">
                <span className="block truncate">
                  {(table.getColumn("year")?.getFilterValue() as string) ||
                    new Date().getFullYear().toString()}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-700 rounded-md shadow-lg max-h-60">
                {uniqueValues.years.map((year) => (
                  <Listbox.Option
                    key={year}
                    value={year}
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

      {/* Table */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-800 text-gray-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`py-2 px-4 font-medium text-center sticky ${
                          header.column.id === "date"
                            ? "left-0 bg-gray-800 z-20"
                            : ""
                        } ${header.column.id === "date" ? "text-left" : ""}`}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span>
                                {header.column.getIsSorted() === "asc"
                                  ? " 🔼"
                                  : " 🔽"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="py-20"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <div className="text-sm text-gray-400">
                          Loading records...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="text-center py-4"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-700 hover:bg-gray-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`py-2 px-4 ${
                            cell.column.id === "date"
                              ? "sticky left-0 bg-gray-900 z-10"
                              : ""
                          } ${
                            cell.column.id === "employeeName"
                              ? "text-left"
                              : "text-center"
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Attendance Modal */}
      <AddAttendanceDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refreshData}
      />

      {/* Edit Attendance Modal */}
      {selectedRecord && (
        <EditAttendanceDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRecord(null);
          }}
          onSuccess={refreshData}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default AttendanceComponent;
