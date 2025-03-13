"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import Link from "next/link";
import { Listbox } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";

interface StudentEarning {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    class: string;
    studentId: string;
    father: {
      name: string;
      phone: string;
    };
    mother: {
      name: string;
      phone: string;
    };
    payment: {
      admissionFee: number;
      formFee: number;
      monthlyFee: number;
    };
  };
  paymentType: string[];
  amount: number;
  date: string;
  receivedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    shortName?: string;
  };
  due?: number;
}

const StudentEarningDetailsComponent = () => {
  const params = useParams();
  const [earnings, setEarnings] = useState<StudentEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/earnings/student/${params.studentId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch earnings");
        }

        const data = await response.json();
        setEarnings(data);
      } catch (error) {
        console.error("Error fetching earnings:", error);
        toast.error("Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };

    if (params.studentId) {
      fetchEarnings();
    }
  }, [params.studentId]);

  const columnHelper = createColumnHelper<StudentEarning>();

  const columns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("paymentType", {
      header: "Purpose",
      cell: (info) => info.getValue().join(", "),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => `৳ ${(info.getValue() || 0).toLocaleString()}`,
    }),
    columnHelper.accessor("receivedBy", {
      header: "Received By",
      cell: (info) => {
        const receivedBy = info.getValue();
        if (!receivedBy) return "-";
        return (
          `${receivedBy.firstName} ${receivedBy.lastName}` ||
          receivedBy.shortName
        );
      },
    }),
    // columnHelper.accessor("due", {
    //   header: "Due",
    //   cell: (info) =>
    //     info.getValue() ? `৳ ${info.getValue().toLocaleString()}` : "-",
    // }),
  ];

  const table = useReactTable({
    data: earnings,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading || !earnings.length) {
    return (
      <div className="p-4 rounded-md bg-gray-900 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const studentInfo = earnings[0].studentId;

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Student Earning Details</h1>
        <Link
          href={`/accounts/earnings`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <span>←</span>
          Back to Earnings
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Student Information Card */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Student Information</h2>
          <div className="space-y-2">
            <p>
              <span className="text-gray-400">Student Name:</span>{" "}
              {studentInfo.name || "-"}
            </p>
            <p>
              <span className="text-gray-400">Class:</span>{" "}
              {studentInfo.class || "-"}
            </p>
            <p>
              <span className="text-gray-400">Student ID:</span>{" "}
              {studentInfo.studentId || "-"}
            </p>
          </div>
        </div>

        {/* Parents Information Card */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Parents Information</h2>
          <div className="space-y-2">
            <p>
              <span className="text-gray-400">Father&apos;s Name:</span>{" "}
              {studentInfo.father?.name || "-"}
            </p>
            <p>
              <span className="text-gray-400">Father&apos;s Phone:</span>{" "}
              {studentInfo.father?.phone || "-"}
            </p>
            <p>
              <span className="text-gray-400">Mother&apos;s Name:</span>{" "}
              {studentInfo.mother?.name || "-"}
            </p>
            <p>
              <span className="text-gray-400">Mother&apos;s Phone:</span>{" "}
              {studentInfo.mother?.phone || "-"}
            </p>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="space-y-2">
            <p>
              <span className="text-gray-400">Admission Fee:</span> ৳{" "}
              {(studentInfo.payment?.admissionFee || 0).toLocaleString() || "-"}
            </p>
            <p>
              <span className="text-gray-400">Form Fee:</span> ৳{" "}
              {(studentInfo.payment?.formFee || 0).toLocaleString() || "-"}
            </p>
            <p>
              <span className="text-gray-400">Monthly Fee:</span> ৳{" "}
              {(studentInfo.payment?.monthlyFee || 0).toLocaleString() || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-primary rounded-lg mt-8">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>
        <div className="overflow-x-auto mt-4 rounded-lg overflow-hidden border border-gray-700">
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-700">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  {[10, 20, 30, 40, 50].map((pageSize) => (
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
      </div>
    </div>
  );
};

export default StudentEarningDetailsComponent;
