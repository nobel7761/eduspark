"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { useSearch } from "@/context/SearchContext";
import { Menu } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import { MdViewColumn } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import { toast } from "react-toastify";
import AddAttendanceDialog from "@/components/Dialogs/AddAttendanceDialog";
import { EmployeeType } from "@/enums/employees.enum";

interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeType: EmployeeType;
  };
  date: string;
  isPresentOnTime: boolean;
  comments?: string;
}

const DEFAULT_VISIBLE_COLUMNS = {
  employeeName: true,
  date: true,
  isPresentOnTime: true,
  employeeType: true,
  comments: true,
  month: false,
  year: false,
};

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const AttendanceComponent = () => {
  const { searchQuery } = useSearch();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/attendance`
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
  }, [refreshTrigger]);

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    return records.filter((record) => {
      if (!searchQuery?.trim()) return true;
      const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`;
      return (
        employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(record.date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, records]);

  const columnHelper = createColumnHelper<AttendanceRecord>();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor(
        (row) => `${row.employeeId.firstName} ${row.employeeId.lastName}`,
        {
          id: "employeeName",
          header: "Employee Name",
          cell: (info) => info.getValue(),
          enableColumnFilter: true,
          filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            return row.getValue(columnId) === filterValue;
          },
        }
      ),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      }),
      columnHelper.accessor("isPresentOnTime", {
        header: "Late Join",
        cell: (info) => (
          <div className="text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                !info.getValue()
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {info.getValue() ? "No" : "Yes"}
            </span>
          </div>
        ),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === "") return true;
          const isPresentOnTime = row.getValue(columnId);
          return isPresentOnTime === (filterValue === "true");
        },
      }),
      columnHelper.accessor((row) => row.employeeId.employeeType, {
        id: "employeeType",
        header: "Employee Type",
        cell: (info) => (
          <div className="text-center">
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("comments", {
        header: "Comments",
        cell: (info) => info.getValue() || "-",
      }),
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
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: filteredRecords,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Get unique values for filters
  const uniqueValues = React.useMemo(() => {
    if (!records) return { employees: [], months: [], years: [] };
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
      years: Array.from(
        new Set(records.map((record) => new Date(record.date).getFullYear()))
      ).sort((a, b) => b - a),
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

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {table.getState().columnFilters.map((filter) => {
              let displayValue = String(filter.value);

              if (filter.id === "month") {
                displayValue = new Date(
                  2024,
                  parseInt(filter.value as string)
                ).toLocaleString("default", { month: "long" });
              } else if (filter.id === "isPresentOnTime") {
                displayValue = filter.value === "true" ? "No" : "Yes";
              }

              return (
                <div
                  key={filter.id}
                  className="flex items-center gap-x-2 px-2 py-1 bg-gray-700 rounded-full text-sm"
                >
                  <span>{displayValue}</span>
                  <button
                    onClick={() =>
                      table.getColumn(filter.id)?.setFilterValue("")
                    }
                    className="text-red-500 hover:text-red-600 bg-white rounded-full"
                  >
                    <IoCloseCircle size={16} />
                  </button>
                </div>
              );
            })}
            {table.getState().columnFilters.length > 0 && (
              <button
                onClick={() => table.resetColumnFilters()}
                className="px-2 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full"
              >
                Reset All
              </button>
            )}
          </div>
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

          {/* Filters */}
          <Menu as="div" className="relative">
            <Menu.Button className="text-2xl text-gray-400 hover:text-white">
              <IoMdOptions />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-4">
                {/* Employee Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("employeeName")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("employeeName")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.employees.map((employee) => (
                      <option key={employee} value={employee}>
                        {employee}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Month
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("month")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(e) =>
                      table.getColumn("month")?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.months.map((month) => (
                      <option key={month} value={month}>
                        {new Date(2024, month).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("year")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(e) =>
                      table.getColumn("year")?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Late Join Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Late Join
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("isPresentOnTime")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("isPresentOnTime")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="true">No</option>
                    <option value="false">Yes</option>
                  </select>
                </div>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-2 px-4 font-medium ${
                      header.column.id === "employeeName"
                        ? "text-left"
                        : "text-center"
                    }`}
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
                <td colSpan={table.getAllColumns().length} className="py-20">
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

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <span className="text-sm">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="bg-gray-700 text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {PAGE_SIZES.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-x-4">
          <span className="text-sm">
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>
          <div className="flex gap-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Attendance Modal */}
      <AddAttendanceDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default AttendanceComponent;
