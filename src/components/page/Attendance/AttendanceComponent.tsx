"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Menu } from "@headlessui/react";
import { IoMdOptions } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { useSearch } from "@/context/SearchContext";
import { useForm } from "react-hook-form";
import SuccessPopup from "@/components/UI/SuccessPopup";
import FailedPopup from "@/components/UI/FailedPopup";
import AddAttendanceDialog from "@/components/Dialogs/AddAttendanceDialog";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

export type AttendanceRecord = {
  id: string;
  name: string;
  designation: "Teacher" | "Homemaid";
  date: string;
  status: "Present" | "Absent";
  comments?: string;
};

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    name: "Nusrat 1",
    designation: "Teacher",
    date: "2022-01-01",
    status: "Present",
    comments: "Arrived on time",
  },
  {
    id: "2",
    name: "Nusrat 2",
    designation: "Teacher",
    date: "2023-02-02",
    status: "Absent",
    comments: "Sick leave",
  },
  {
    id: "3",
    name: "Lolita",
    designation: "Homemaid",
    date: "2024-03-03",
    status: "Present",
  },
  {
    id: "4",
    name: "Nusrat 2",
    designation: "Teacher",
    date: "2025-11-30",
    status: "Present",
  },
  {
    id: "5",
    name: "Lolita",
    designation: "Homemaid",
    date: "2021-12-31",
    status: "Absent",
    comments: "Personal emergency",
  },
  {
    id: "5",
    name: "Lolita",
    designation: "Homemaid",
    date: "2021-06-30",
    status: "Absent",
    comments: "Personal emergency",
  },
];

type AttendanceFormData = {
  staffId: string;
  date: string;
  inTime: string;
  outTime: string;
  comments?: string;
};

const AttendanceComponent = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    year: false,
    month: false,
  });

  const { searchQuery } = useSearch();

  const filteredAttendanceData = React.useMemo(() => {
    return mockAttendanceData.filter((record) => {
      if (!searchQuery?.trim()) return true;

      const searchTerm = searchQuery.toLowerCase();
      return (
        record.name.toLowerCase().includes(searchTerm) ||
        record.designation.toLowerCase().includes(searchTerm) ||
        record.date.toLowerCase().includes(searchTerm) ||
        record.status.toLowerCase().includes(searchTerm) ||
        record.comments?.toLowerCase().includes(searchTerm) ||
        false
      );
    });
  }, [searchQuery]);

  // Get unique months and years from the data
  const uniqueValues = {
    years: Array.from(
      new Set(
        mockAttendanceData.map((record) => new Date(record.date).getFullYear())
      )
    ).sort((a, b) => b - a),
    months: Array.from(
      new Set(
        mockAttendanceData.map((record) => new Date(record.date).getMonth())
      )
    ).sort((a, b) => a - b),
    designations: Array.from(
      new Set(mockAttendanceData.map((record) => record.designation))
    ),
    names: Array.from(
      new Set(mockAttendanceData.map((record) => record.name))
    ).sort(),
  };

  const columnHelper = createColumnHelper<AttendanceRecord>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        return row.getValue(columnId) === filterValue;
      },
    }),
    columnHelper.accessor("designation", {
      header: "Designation",
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        return row.getValue(columnId) === filterValue;
      },
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue());
        const day = date.getDate();
        const suffix = (day: number) => {
          if (day > 3 && day < 21) return "th";
          switch (day % 10) {
            case 1:
              return "st";
            case 2:
              return "nd";
            case 3:
              return "rd";
            default:
              return "th";
          }
        };
        return `${day}${suffix(day)} ${date.toLocaleString("default", {
          month: "long",
        })}, ${date.getFullYear()}`;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            info.getValue() === "Present"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("comments", {
      header: "Comments",
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor((row) => new Date(row.date).getFullYear(), {
      id: "year",
      enableColumnFilter: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const year = new Date(row.getValue("date")).getFullYear();
        return year === parseInt(filterValue);
      },
    }),
    columnHelper.accessor((row) => new Date(row.date).getMonth(), {
      id: "month",
      enableColumnFilter: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const month = new Date(row.getValue("date")).getMonth();
        return month === parseInt(filterValue);
      },
    }),
  ];

  const table = useReactTable({
    data: filteredAttendanceData,
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const { reset } = useForm<AttendanceFormData>();

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      // TODO: Implement your API call here
      console.log("Form data:", data);

      setIsAddModalOpen(false);
      reset();
      setPopup({
        isOpen: true,
        message: "Attendance added successfully!",
        type: "success",
      });

      setTimeout(() => {
        setPopup((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
    } catch (error) {
      console.log(error);
      setPopup({
        isOpen: true,
        message: "Failed to add attendance. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setPopup((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
    }
  };

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Attendance Report</h2>

        <div className="flex items-center gap-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>Add Attendance</span>
          </button>
          {/* Active Filters Display */}
          <div className="flex flex-wrap items-center gap-2">
            {table.getState().columnFilters.map((filter) => {
              let displayValue = String(filter.value);

              if (filter.id === "designation") {
                displayValue = String(filter.value);
              } else if (filter.id === "month") {
                // Convert month number to capitalized month name
                displayValue = new Date(
                  2024,
                  parseInt(filter.value as string)
                ).toLocaleString("default", { month: "long" });
              } else if (filter.id === "year" && filter.value === "0") {
                // Skip rendering if value is "0"
                return null;
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

          {/* Filter Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="text-2xl text-gray-400 hover:text-white">
              <IoMdOptions />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-4">
                {/* Name Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("name")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(e) =>
                      table.getColumn("name")?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.names.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Designation
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("designation")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("designation")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.designations.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("status")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(e) =>
                      table.getColumn("status")?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
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
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-4 text-left"
                    colSpan={header.colSpan}
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="py-4 text-center text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-4">
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
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
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
        onSubmit={onSubmit}
        uniqueNames={uniqueValues.names}
      />

      {/* Success/Error Popup */}
      <SuccessPopup
        isOpen={popup.isOpen && popup.type === "success"}
        onClose={() =>
          setPopup({ isOpen: false, message: "", type: "success" })
        }
        message={popup.message}
      />
      <FailedPopup
        isOpen={popup.isOpen && popup.type === "error"}
        onClose={() => setPopup({ isOpen: false, message: "", type: "error" })}
        message={popup.message}
      />
    </div>
  );
};

export default AttendanceComponent;
