"use client";

import React, { useState, useCallback } from "react";
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
import { IStudent } from "@/types/student";
import { useSearch } from "@/context/SearchContext";
import { searchStudent } from "@/utils/search/studentSearch";
import { useRouter } from "next/navigation";
import DeletePopup from "@/components/UI/DeletePopup";
import SuccessPopup from "@/components/UI/SuccessPopup";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const AllStudentsComponent = () => {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    student: IStudent | null;
  }>({ isOpen: false, student: null });
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const columnHelper = createColumnHelper<IStudent>();

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    return allStudentsList.filter((student) => {
      if (!searchQuery?.trim()) return true;
      return searchStudent(student, searchQuery);
    });
  }, [searchQuery]);

  const handleEdit = useCallback(
    (studentId: string) => {
      router.push(`/students/${studentId}`);
    },
    [router]
  );

  const handleDelete = (student: IStudent) => {
    setDeletePopup({ isOpen: true, student });
  };

  const confirmDelete = () => {
    // Implement delete logic here
    console.log("Deleting student:", deletePopup.student?.studentId);
    setDeletePopup({ isOpen: false, student: null });
    setSuccessPopup({
      isOpen: true,
      message: "Student deleted successfully",
    });
  };

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: (info) => (
          <div>
            <div>
              {info.row.original.firstName} {info.row.original.lastName} (
              {info.row.original.studentId})
            </div>
            <div className="text-sm text-gray-400">
              {info.row.original.primaryPhone}
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
      // columnHelper.accessor("sex", {
      //   header: "Gender",
      //   cell: (info) => {
      //     const genderValue = info.row.original.sex;
      //     switch (genderValue) {
      //       case Sex.MALE:
      //         return "Male";
      //       case Sex.FEMALE:
      //         return "Female";
      //     }
      //   },
      // }),
      columnHelper.accessor("fatherName", {
        header: "Father Name",
        cell: (info) => (
          <div>
            <div>{info.row.original.fatherName}</div>
            <div className="text-sm text-gray-400">
              {info.row.original.fatherPhone}
            </div>
            <div className="text-sm text-gray-400">
              {info.row.original.fatherOccupation}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("motherName", {
        header: "Mother Name",
        cell: (info) => (
          <div>
            <div>{info.row.original.motherName}</div>
            <div className="text-sm text-gray-400">
              {info.row.original.motherPhone}
            </div>
            <div className="text-sm text-gray-400">
              {info.row.original.motherOccupation}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("admissionDate", {
        header: "Admission Date",
        cell: (info) => info.row.original.admissionDate,
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
      columnHelper.accessor("studentId", {
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(info.getValue())}
              className="text-blue-500 hover:text-blue-400 text-2xl"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => handleDelete(info.row.original)}
              className="text-red-500 hover:text-red-400 text-2xl"
            >
              <MdDelete />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper, handleEdit]
  );

  const table = useReactTable({
    data: filteredStudents,
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
      {filteredStudents.length === 0 ? (
        <div className="text-center py-4">No students found</div>
      ) : (
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
      )}

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

      <DeletePopup
        isOpen={deletePopup.isOpen}
        onClose={() => setDeletePopup({ isOpen: false, student: null })}
        onDelete={confirmDelete}
        itemName={`${deletePopup.student?.firstName} ${deletePopup.student?.lastName}`}
      />

      <SuccessPopup
        isOpen={successPopup.isOpen}
        message={successPopup.message}
        onClose={() => setSuccessPopup({ isOpen: false, message: "" })}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default AllStudentsComponent;
