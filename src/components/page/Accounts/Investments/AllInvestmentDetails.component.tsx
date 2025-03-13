"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { MdViewColumn } from "react-icons/md";
import Link from "next/link";
import AddInvestmentDialog from "@/components/Dialogs/AddInvestmentDialog";
import { toast } from "react-toastify";

interface InvestmentRecord {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    expectedInvestmentAmount: number;
  };
  amount: number;
  date: string;
  comments?: string;
}

interface ProcessedInvestmentRecord {
  directorId: string;
  name: string;
  totalInvestmentAmount: number;
  expectedInvestmentAmount: number;
  dueInvestment: number;
  sharePercentage: number;
}

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const DEFAULT_VISIBLE_COLUMNS = {
  name: true,
  investMentAmount: true,
  expectedInvestmentAmount: true,
  dueInvestment: true,
  sharePercentage: true,
};

const AllInvestmentDetailsComponent = () => {
  const { searchQuery } = useSearch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investmentData, setInvestmentData] = useState<
    ProcessedInvestmentRecord[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch and process investment data
  useEffect(() => {
    fetchInvestments();
  }, [refreshTrigger]);

  // Move fetchInvestments outside useEffect so we can reuse it
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/investments`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch investment data");
      }

      const data: InvestmentRecord[] = await response.json();

      // Process and aggregate the data by director
      const processedData = data.reduce(
        (acc: { [key: string]: ProcessedInvestmentRecord }, curr) => {
          const directorId = curr.employeeId._id;

          if (!acc[directorId]) {
            acc[directorId] = {
              directorId,
              name: `${curr.employeeId.firstName} ${curr.employeeId.lastName}`,
              totalInvestmentAmount: 0,
              expectedInvestmentAmount:
                curr.employeeId.expectedInvestmentAmount,
              dueInvestment: 0,
              sharePercentage: 25, // Default value, update as needed
            };
          }

          acc[directorId].totalInvestmentAmount += curr.amount;
          acc[directorId].dueInvestment =
            acc[directorId].expectedInvestmentAmount -
            acc[directorId].totalInvestmentAmount;

          return acc;
        },
        {}
      );

      setInvestmentData(Object.values(processedData));
    } catch (error) {
      console.error("Error fetching investments:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch investment data"
      );
      toast.error("Failed to load investment data");
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on search query
  const filteredRecords = React.useMemo(() => {
    if (!investmentData) return [];
    return investmentData.filter((record) => {
      if (!searchQuery?.trim()) return true;
      return record.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, investmentData]);

  // Define columns
  const columnHelper = createColumnHelper<ProcessedInvestmentRecord>();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => <div className="text-left">{info.getValue()}</div>,
      }),
      columnHelper.accessor("totalInvestmentAmount", {
        header: () => (
          <div className="text-center">Total Investment Amount</div>
        ),
        cell: (info) => (
          <div className="text-center">
            ৳ {(info.getValue() || 0).toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor("expectedInvestmentAmount", {
        header: () => (
          <div className="text-center">Expected Investment Amount</div>
        ),
        cell: (info) => (
          <div className="text-center">
            ৳ {(info.getValue() || 0).toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor("dueInvestment", {
        header: () => <div className="text-center">Due Investment</div>,
        cell: (info) => (
          <div className="text-center text-red-400">
            ৳ {(info.getValue() || 0).toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor("sharePercentage", {
        header: () => <div className="text-center">Share Holder</div>,
        cell: (info) => (
          <div className="text-center">{info.getValue() || 0}%</div>
        ),
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

  // Add a refresh function (after fetchInvestments)
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Investment Details</h1>
        </div>

        <div className="flex items-center gap-x-4">
          <Link
            href="/accounts/investments/reports"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
          >
            Investment Reports
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Add New Investment Record
          </button>
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
                      {column.id === "name"
                        ? "Name"
                        : column.id === "investMentAmount"
                        ? "Total Invested Amount"
                        : column.id === "expectedInvestmentAmount"
                        ? "Expected Investment Amount"
                        : column.id === "dueInvestment"
                        ? "Due Investment"
                        : column.id === "sharePercentage"
                        ? "Share Holder"
                        : column.id}
                    </label>
                  </div>
                ))}
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
                    className="py-2 px-4 font-medium text-left"
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
                      Loading investment data...
                    </div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-8">
                  <div className="text-center text-red-400">{error}</div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="py-8 text-center text-gray-400"
                >
                  No investment records found
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

      <AddInvestmentDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          toast.success("Investment added successfully");
          refreshData();
        }}
      />
    </div>
  );
};

export default AllInvestmentDetailsComponent;
