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
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
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
import { FaFilter } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    sex: false,
    institute: false,
  });

  const columnHelper = createColumnHelper<IStudent>();

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    return allStudentsList.filter((student) => {
      if (!searchQuery?.trim()) return true;
      return searchStudent(student, searchQuery);
    });
  }, [searchQuery]);

  // Get unique values for filters
  const uniqueValues = React.useMemo(() => {
    return {
      class: Array.from(
        new Set(allStudentsList.map((student) => student.class))
      ).sort((b, a) => {
        // Handle special classes
        const specialClasses = ["arabic", "spoken_english", "drawing"];
        if (
          specialClasses.includes(String(a)) &&
          specialClasses.includes(String(b))
        ) {
          return String(b).localeCompare(String(a));
        }
        if (specialClasses.includes(String(a))) return -1;
        if (specialClasses.includes(String(b))) return 1;
        // Sort numbers in descending order
        return Number(b) - Number(a);
      }),
      sex: Array.from(new Set(allStudentsList.map((student) => student.sex)))
        .sort()
        .reverse(),
      institute: Array.from(
        new Set(allStudentsList.map((student) => student.institute))
      )
        .sort()
        .reverse(),
    };
  }, []);

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
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return String(row.getValue(columnId)) === String(filterValue);
        },
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
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return String(row.getValue(columnId)) === filterValue;
        },
        cell: (info) => {
          const genderValue = info.row.original.sex;
          switch (genderValue) {
            case "male":
              return "Male";
            case "female":
              return "Female";
            default:
              return genderValue;
          }
        },
        enableHiding: true,
      }),
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
      columnHelper.accessor("institute", {
        header: "Institute",
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
        enableHiding: true,
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

  return (
    <div className="p-4 rounded-md bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">All Students</h1>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {table.getState().columnFilters.map((filter) => {
              // Format the display value based on filter type and value
              let displayValue = String(filter.value);
              if (filter.id === "sex") {
                displayValue = filter.value === "male" ? "Male" : "Female";
              } else if (filter.id === "class") {
                switch (filter.value) {
                  case "arabic":
                    displayValue = "Arabic";
                    break;
                  case "spoken_english":
                    displayValue = "Spoken English";
                    break;
                  case "drawing":
                    displayValue = "Drawing";
                    break;
                  default:
                    displayValue = String(filter.value);
                }
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
          </div>
        </div>

        <Menu as="div" className="relative">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`text-xl ${
                  active ? "text-white" : "text-gray-400"
                } hover:text-white`}
              >
                <FaFilter />
              </button>
            )}
          </Menu.Item>

          <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-10">
            <div className="space-y-4">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  className="w-full bg-gray-700 rounded p-1 text-sm"
                  value={
                    (table.getColumn("class")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(e) =>
                    table.getColumn("class")?.setFilterValue(e.target.value)
                  }
                >
                  <option value="">All</option>
                  {uniqueValues.class.map((value) => (
                    <option key={value} value={value}>
                      {(() => {
                        switch (value) {
                          case "arabic":
                            return "Arabic";
                          case "spoken_english":
                            return "Spoken English";
                          case "drawing":
                            return "Drawing";
                          default:
                            return `Class ${value}`;
                        }
                      })()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sex Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full bg-gray-700 rounded p-1 text-sm"
                  value={
                    (table.getColumn("sex")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(e) =>
                    table.getColumn("sex")?.setFilterValue(e.target.value)
                  }
                >
                  <option value="">All</option>
                  {uniqueValues.sex.map((value) => (
                    <option key={value} value={value}>
                      {value === "male" ? "Male" : "Female"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institute Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Institute
                </label>
                <select
                  className="w-full bg-gray-700 rounded p-1 text-sm"
                  value={
                    (table
                      .getColumn("institute")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(e) =>
                    table.getColumn("institute")?.setFilterValue(e.target.value)
                  }
                >
                  <option value="">All</option>
                  {uniqueValues.institute.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Menu.Items>
        </Menu>
      </div>
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
