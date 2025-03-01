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
import PageLoader from "@/components/shared/PageLoader";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

interface ApiClassCount {
  classIds: { name: string }[];
  count: number;
  comments?: string;
}

interface ApiProxyClass {
  employeeId:
    | {
        _id: string;
        firstName: string;
        lastName: string;
      }
    | string;
  employeeName?: string;
  classId:
    | {
        _id: string;
        name: string;
      }
    | string;
  className?: string;
  comments?: string;
}

interface ApiRecord {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  classes: ApiClassCount[];
  hasProxyClass: boolean;
  proxyClasses: ApiProxyClass[];
}

interface ClassCount {
  classIds: string[];
  count: number;
  comments?: string;
}

interface ProxyClass {
  employeeId: string;
  employeeName: string;
  classId: string;
  className: string;
  comments?: string;
}

interface ClassCountRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  classes: ClassCount[];
  hasProxyClass: boolean;
  proxyClasses: ProxyClass[];
}

const DEFAULT_VISIBLE_COLUMNS = {
  employeeName: true,
  date: true,
  "class-3-8": true,
  "class-9-10": true,
  "class-11-12": true,
  hasProxyClass: true,
  proxyDetails: false,
  month: false,
  year: false,
};

const TeacherClassCountRecordsComponent = () => {
  const { searchQuery } = useSearch();
  const [records, setRecords] = useState<ClassCountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/monthly-class-count`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch class count records");
        }
        const data = await response.json();

        // Transform the data to match the expected format
        const transformedData = data.map((record: ApiRecord) => ({
          _id: record._id,
          employeeId: record.employeeId._id,
          employeeName: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
          date: record.date,
          classes: record.classes.map((classGroup: ApiClassCount) => ({
            classIds: classGroup.classIds.map((cls) => cls.name),
            count: classGroup.count,
            comments: classGroup.comments,
          })),
          hasProxyClass: record.hasProxyClass,
          proxyClasses: record.proxyClasses.map((proxy: ApiProxyClass) => ({
            employeeId:
              typeof proxy.employeeId === "string"
                ? proxy.employeeId
                : proxy.employeeId._id,
            employeeName:
              typeof proxy.employeeId === "string"
                ? proxy.employeeName
                : `${proxy.employeeId.firstName} ${proxy.employeeId.lastName}`,
            classId:
              typeof proxy.classId === "string"
                ? proxy.classId
                : proxy.classId._id,
            className:
              typeof proxy.classId === "string"
                ? proxy.className
                : proxy.classId.name,
            comments: proxy.comments,
          })),
        }));

        setRecords(transformedData);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("Failed to load class count records");
        toast.error("Failed to load class count records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    return records.filter((record) => {
      if (!searchQuery?.trim()) return true;
      return (
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(record.date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, records]);

  const columnHelper = createColumnHelper<ClassCountRecord>();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("employeeName", {
        header: "Teacher Name",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
      }),
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
      columnHelper.accessor(
        (row) => {
          const classRange = row.classes.find((c) =>
            c.classIds.some((id) => ["3", "4", "5", "6", "7", "8"].includes(id))
          );
          return classRange?.count || 0;
        },
        {
          id: "class-3-8",
          header: "Class 3-8",
          cell: (info) => (
            <div className="text-center">
              {info.getValue() > 0 ? (
                <span className="px-2 py-1 bg-green-600 text-white rounded-full">
                  {info.getValue()}
                </span>
              ) : (
                "-"
              )}
            </div>
          ),
        }
      ),
      columnHelper.accessor(
        (row) => {
          const classRange = row.classes.find((c) =>
            c.classIds.some((id) => ["9", "10"].includes(id))
          );
          return classRange?.count || 0;
        },
        {
          id: "class-9-10",
          header: "Class 9-10",
          cell: (info) => (
            <div className="text-center">
              {info.getValue() > 0 ? (
                <span className="px-2 py-1 bg-green-600 text-white rounded-full">
                  {info.getValue()}
                </span>
              ) : (
                "-"
              )}
            </div>
          ),
        }
      ),
      columnHelper.accessor(
        (row) => {
          const classRange = row.classes.find((c) =>
            c.classIds.some((id) => ["11", "12"].includes(id))
          );
          return classRange?.count || 0;
        },
        {
          id: "class-11-12",
          header: "Class 11-12",
          cell: (info) => (
            <div className="text-center">
              {info.getValue() > 0 ? (
                <span className="px-2 py-1 bg-green-600 text-white rounded-full">
                  {info.getValue()}
                </span>
              ) : (
                "-"
              )}
            </div>
          ),
        }
      ),
      columnHelper.accessor("hasProxyClass", {
        header: "Proxy Class Taken",
        cell: (info) => (
          <div className="text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                info.getValue()
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {info.getValue() ? "Yes" : "No"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("proxyClasses", {
        id: "proxyDetails",
        header: "Proxy Details",
        cell: (info) => {
          const proxyClasses = info.getValue();
          if (!proxyClasses || proxyClasses.length === 0) return "-";
          return (
            <div className="space-y-2">
              {proxyClasses.map((proxy, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-gray-700 rounded-md space-y-1"
                >
                  <div>Teacher: {proxy.employeeName}</div>
                  <div>Class: {proxy.className}</div>
                  {proxy.comments && (
                    <div className="text-gray-400">Note: {proxy.comments}</div>
                  )}
                </div>
              ))}
            </div>
          );
        },
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
    if (!records) return { teachers: [], months: [], years: [] };
    return {
      teachers: Array.from(
        new Set(records.map((record) => record.employeeName))
      ).sort(),
      months: Array.from(
        new Set(records.map((record) => new Date(record.date).getMonth()))
      ).sort((a, b) => a - b),
      years: Array.from(
        new Set(records.map((record) => new Date(record.date).getFullYear()))
      ).sort((a, b) => b - a),
    };
  }, [records]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Class Count Records</h1>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {table.getState().columnFilters.map((filter) => {
              let displayValue = String(filter.value);

              if (filter.id === "month") {
                displayValue = new Date(
                  2024,
                  parseInt(filter.value as string)
                ).toLocaleString("default", { month: "long" });
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
          <Link
            href="/teacher-class-count"
            className="flex items-center gap-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            <IoArrowBack size={16} />
            Go Back
          </Link>

          {/* Column Visibility */}
          <Menu as="div" className="relative">
            <Menu.Button className="text-3xl text-gray-400 hover:text-white">
              <MdViewColumn />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-2">
                {table.getAllLeafColumns().map((column) => (
                  <div key={column.id} className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
                    />
                    <label className="text-sm">
                      {column.id === "employeeName"
                        ? "Teacher Name"
                        : column.id === "class-3-8"
                        ? "Class 3-8"
                        : column.id === "class-9-10"
                        ? "Class 9-10"
                        : column.id === "class-11-12"
                        ? "Class 11-12"
                        : column.id === "hasProxyClass"
                        ? "Proxy Class Taken"
                        : column.id === "proxyDetails"
                        ? "Proxy Details"
                        : column.id.charAt(0).toUpperCase() +
                          column.id.slice(1)}
                    </label>
                  </div>
                ))}
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
                {/* Teacher Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teacher
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
                    {uniqueValues.teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
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
                      [
                        "class-3-8",
                        "class-9-10",
                        "class-11-12",
                        "hasProxyClass",
                      ].includes(header.id)
                        ? "text-center"
                        : "text-left"
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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
            {[10, 20, 30, 40, 50].map((pageSize) => (
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
    </div>
  );
};

export default TeacherClassCountRecordsComponent;
