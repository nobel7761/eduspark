"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import Link from "next/link";

interface InvestmentRecord {
  date: string;
  amount: number;
}

interface GroupedInvestmentRecord {
  employeeName: string;
  investmentRecords: InvestmentRecord[];
  totalInvestment: number;
}

const AllInvestmentRecordsComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedRecords, setGroupedRecords] = useState<
    GroupedInvestmentRecord[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchInvestmentRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/investments/reports`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch investment records");
        }
        const data = await response.json();
        if (isMounted) {
          setGroupedRecords(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching investment records:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch investment records"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInvestmentRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  // Create a flat data structure for the table
  const employeeData = groupedRecords.reduce((acc, group) => {
    acc[group.employeeName] = group.investmentRecords.map((record) => ({
      date: record.date,
      amount: record.amount,
    }));
    return acc;
  }, {} as { [key: string]: { date: string; amount: number }[] });

  // Get the maximum number of records among all employees
  const maxRecords = Math.max(
    ...Object.values(employeeData).map((records) => records.length)
  );

  // Create table data with actual records only
  const tableData = Array.from({ length: maxRecords }, (_, index) => {
    const rowData: { [key: string]: string | number } = {};
    Object.keys(employeeData).forEach((employeeName) => {
      const record = employeeData[employeeName][index];
      if (record) {
        rowData[`${employeeName}_date`] = record.date;
        rowData[`${employeeName}_amount`] = record.amount;
      }
    });
    return rowData;
  }).filter((row) => Object.keys(row).length > 0);

  const columnHelper = createColumnHelper<{ [key: string]: string | number }>();

  const columns = groupedRecords.map((group) =>
    columnHelper.group({
      id: group.employeeName,
      header: group.employeeName,
      columns: [
        columnHelper.accessor((row) => row[`${group.employeeName}_date`], {
          id: `${group.employeeName}_date`,
          header: "Date",
          cell: (info) => {
            const value = info.getValue();
            return value ? new Date(value).toLocaleDateString() : null;
          },
          enableSorting: false,
        }),
        columnHelper.accessor((row) => row[`${group.employeeName}_amount`], {
          id: `${group.employeeName}_amount`,
          header: "Amount",
          cell: (info) => {
            const value = info.getValue();
            return value ? `৳ ${(value || 0).toLocaleString()}` : null;
          },
          enableSorting: false,
        }),
      ],
    })
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Investment Records</h1>
        </div>

        <div className="flex items-center gap-x-4">
          <Link
            href="/accounts/investments"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-x-2"
          >
            <span>←</span>
            Back to Investment Details
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          <p className="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
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
                      colSpan={header.colSpan}
                      className={`py-2 px-4 font-medium text-center border-r border-gray-700 last:border-r-0 ${
                        !header.isPlaceholder && header.colSpan > 1
                          ? "border-b border-gray-600"
                          : ""
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          } ${
                            header.colSpan > 1
                              ? "text-lg text-white font-bold"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                        Loading investment records...
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-700 hover:bg-gray-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-2 px-4 text-center border-r border-gray-700 last:border-r-0"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="border-t-2 border-gray-600 bg-gray-800">
                    {groupedRecords.map((group) => (
                      <td
                        key={group.employeeName}
                        colSpan={2}
                        className="py-3 px-4 text-center font-medium border-r border-gray-700 last:border-r-0"
                      >
                        ৳ {group.totalInvestment}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllInvestmentRecordsComponent;
