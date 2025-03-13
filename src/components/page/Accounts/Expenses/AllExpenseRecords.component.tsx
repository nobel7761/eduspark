"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Menu, Listbox } from "@headlessui/react";
import { MdViewColumn } from "react-icons/md";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import AddExpenseDialog from "@/components/Dialogs/AddExpenseDialog";

interface ExpenseRecord {
  _id: string;
  purpose: string[];
  amount: number;
  date: string;
  comments?: string;
  paidBy: {
    _id: string;
    firstName: string;
    lastName: string;
    shortName?: string;
  };
}

interface ExpenseResponse {
  expenses: ExpenseRecord[];
  totalExpense: number;
  expensesByType: {
    [key: string]: number;
  };
  month: string;
  year: number;
}

const DEFAULT_VISIBLE_COLUMNS = {
  date: true,
  purpose: true,
  amount: true,
  paidBy: true,
  comments: false,
};

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const AllExpenseRecordsComponent = () => {
  const { searchQuery } = useSearch();
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [expensesSummary, setExpensesSummary] = useState<{
    totalExpense: number;
    expensesByType: { [key: string]: number };
  }>({ totalExpense: 0, expensesByType: {} });
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setTableLoading(true);
        setError(null);

        const monthStr = selectedMonth.toString().padStart(2, "0");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/expenses/monthly?month=${monthStr}&year=${selectedYear}`
        );

        if (response.status === 404) {
          throw new Error("Unable to connect server");
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Error: ${response.status} - ${response.statusText}`
          );
        }

        const data: ExpenseResponse = await response.json();
        setRecords(data.expenses);
        setExpensesSummary({
          totalExpense: data.totalExpense,
          expensesByType: data.expensesByType,
        });
      } catch (error) {
        console.error("Error fetching records:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setTableLoading(false);
      }
    };

    fetchRecords();
  }, [refreshTrigger, selectedMonth, selectedYear]);

  const filteredRecords = useMemo(() => {
    if (!records) return [];
    return records.filter((record) => {
      if (!searchQuery?.trim()) return true;
      return (
        record.purpose.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        record.paidBy.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        record.paidBy.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        new Date(record.date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, records]);

  const columnHelper = createColumnHelper<ExpenseRecord>();

  const columns = [
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
    columnHelper.accessor("purpose", {
      header: "Purpose",
      cell: (info) => info.getValue().join(", "),
    }),
    columnHelper.accessor("amount", {
      header: () => <div className="text-center">Amount</div>,
      cell: (info) => (
        <div className="text-center">৳ {info.getValue().toLocaleString()}</div>
      ),
    }),
    columnHelper.accessor("paidBy", {
      header: "Paid By",
      cell: (info) => {
        const paidBy = info.getValue();
        return paidBy ? `${paidBy.firstName} ${paidBy.lastName}` : "-";
      },
    }),
    columnHelper.accessor("comments", {
      header: "Comments",
      cell: (info) => info.getValue() || "-",
    }),
  ];

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

  const MonthYearSelector = () => {
    const months = [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

    return (
      <div className="flex gap-x-4">
        <Listbox value={selectedMonth} onChange={setSelectedMonth}>
          <div className="relative">
            <Listbox.Button className="relative w-40 py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
              <span className="block truncate">
                {months.find((m) => m.value === selectedMonth)?.label}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
              {months.map((month) => (
                <Listbox.Option
                  key={month.value}
                  value={month.value}
                  className={({ active }) =>
                    `${
                      active ? "bg-primary text-white" : "text-white"
                    } cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {month.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <FaCheckCircle className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <Listbox value={selectedYear} onChange={setSelectedYear}>
          <div className="relative">
            <Listbox.Button className="relative w-32 py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
              <span className="block truncate">{selectedYear}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
              {years.map((year) => (
                <Listbox.Option
                  key={year}
                  value={year}
                  className={({ active }) =>
                    `${
                      active ? "bg-primary text-white" : "text-white"
                    } cursor-pointer select-none relative py-2 pl-10 pr-4`
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
                          <FaCheckCircle className="h-5 w-5" />
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
    );
  };

  if (error) {
    return (
      <div className="p-4 rounded-md bg-gray-900 text-white">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️ Error</div>
          <div className="text-lg font-medium">{error}</div>
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Expense Details</h1>
        </div>

        <div className="flex items-center gap-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Add New Expense Record
          </button>

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
                      {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      <MonthYearSelector />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-2">Total Expenses</h3>
          <p className="text-2xl font-semibold">
            ৳ {expensesSummary.totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      {tableLoading ? (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 border-t border-gray-700 bg-gray-900"
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-800 text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-4 text-left font-medium"
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
                    className="py-8 text-center text-gray-400"
                  >
                    No expense records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer"
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
      )}

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

          <Listbox
            value={table.getState().pagination.pageSize}
            onChange={(value) => table.setPageSize(Number(value))}
          >
            <div className="relative">
              <Listbox.Button className="relative w-32 py-2 pl-3 pr-10 text-left bg-gray-800 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-white">
                <span className="block truncate">
                  Show {table.getState().pagination.pageSize}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-gray-800 rounded-md shadow-lg max-h-60">
                {PAGE_SIZES.map((pageSize) => (
                  <Listbox.Option
                    key={pageSize}
                    value={pageSize}
                    className={({ active }) =>
                      `${
                        active ? "bg-primary text-white" : "text-white"
                      } cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          Show {pageSize}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <FaCheckCircle className="h-5 w-5" />
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

        <div className="flex gap-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-700 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-700 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AddExpenseDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default AllExpenseRecordsComponent;
