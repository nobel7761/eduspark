"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { allStudentsList } from "../../../../public/data/students";
import { IStudent, Sex } from "@/types/student";

const AllStudentsComponent = () => {
  const students: IStudent[] = allStudentsList;

  const columnHelper = createColumnHelper<IStudent>();

  // Table columns
  const columns = [
    columnHelper.accessor("firstName", {
      header: "Name",
      cell: (info) => (
        <div>
          <div>
            {info.row.original.firstName} {info.row.original.lastName} (
            {info.row.original.studentId})
          </div>
          <div className="text-sm text-gray-400">
            {info.row.original.institute}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("class", {
      header: "Class",
      cell: (info) => {
        const classValue = info.row.original.class;
        switch (classValue) {
          case "arabic":
            return "Arabic";
          case "spoken_english":
            return "Spoken English";
          case "drawing":
            return "Drawing";
          default:
            return classValue;
        }
      },
    }),
    columnHelper.accessor("sex", {
      header: "Gender",
      cell: (info) => {
        const genderValue = info.row.original.sex;
        switch (genderValue) {
          case Sex.MALE:
            return "Male";
          case Sex.FEMALE:
            return "Female";
        }
      },
    }),
    columnHelper.accessor("primaryPhone", {
      header: "Primary Phone",
      cell: (info) => info.row.original.primaryPhone,
    }),
    columnHelper.accessor("fatherName", {
      header: "Father Name",
      cell: (info) => info.row.original.fatherName,
    }),
    columnHelper.accessor("fatherPhone", {
      header: "Father Phone",
      cell: (info) => info.row.original.fatherPhone,
    }),
    columnHelper.accessor("referredBy", {
      header: "Referred By",
      cell: (info) => (
        <div>
          <div>{info.row.original.referredBy.name}</div>
          <div className="text-sm text-gray-400">
            {info.row.original.referredBy.phone}
          </div>
        </div>
      ),
    }),
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: students,
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

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <h1 className="text-lg font-semibold mb-4">All Students</h1>
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

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllStudentsComponent;
