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
  ColumnDef,
  Table,
} from "@tanstack/react-table";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import DeletePopup from "@/components/UI/DeletePopup";
import SuccessPopup from "@/components/UI/SuccessPopup";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { Menu } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import { MdViewColumn } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import Link from "next/link";
import { ITeacher } from "@/types/teacher";
import { allTeachersList } from "../../../../public/data/teachers";
import { searchTeacher } from "@/utils/search/teacherSearch";
import Image from "next/image";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const DEFAULT_VISIBLE_COLUMNS = {
  firstName: true,
  class: true,
  fatherName: true,
  motherName: true,
  admissionDate: false,
  referredBy: true,
  sex: false,
  institute: false,
  studentId: true,
  nidNumber: false,
  paymentType: false,
};

const AllTeachersComponent = () => {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    teacher: ITeacher | null;
    multipleTeachers: ITeacher[] | null;
  }>({ isOpen: false, teacher: null, multipleTeachers: null });
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(
    new Set()
  );

  const columnHelper = createColumnHelper<ITeacher>();

  // Filter students based on search query
  const filteredTeachers = React.useMemo(() => {
    return allTeachersList.filter((teacher) => {
      if (!searchQuery?.trim()) return true;
      return searchTeacher(teacher, searchQuery);
    });
  }, [searchQuery]);

  const handleEdit = useCallback(
    (teacherId: string) => {
      router.push(`/teachers/edit/${teacherId}`);
    },
    [router]
  );

  const handleSelectAll = useCallback(
    (checked: boolean, table: Table<ITeacher>) => {
      if (checked) {
        const allIds = table
          .getRowModel()
          .rows.map((row) => row.original.teacherId);
        setSelectedTeachers(new Set(allIds));
      } else {
        setSelectedTeachers(new Set());
      }
    },
    []
  );

  const handleSelectTeacher = (teacherId: string, checked: boolean) => {
    const newSelected = new Set(selectedTeachers);
    if (checked) {
      newSelected.add(teacherId);
    } else {
      newSelected.delete(teacherId);
    }
    setSelectedTeachers(newSelected);
  };

  const handleDelete = (teachers: ITeacher | ITeacher[]) => {
    if (Array.isArray(teachers)) {
      setDeletePopup({
        isOpen: true,
        teacher: null,
        multipleTeachers: teachers,
      });
    } else {
      setDeletePopup({
        isOpen: true,
        teacher: teachers,
        multipleTeachers: null,
      });
    }
  };

  const confirmDelete = () => {
    // Implement delete logic here
    if (deletePopup.multipleTeachers) {
      console.log(
        "Deleting multiple teachers:",
        deletePopup.multipleTeachers.map((t) => t.teacherId)
      );
      setSelectedTeachers(new Set());
    } else if (deletePopup.teacher) {
      console.log("Deleting teacher:", deletePopup.teacher.teacherId);
    }

    setDeletePopup({ isOpen: false, teacher: null, multipleTeachers: null });
    setSuccessPopup({
      isOpen: true,
      message: deletePopup.multipleTeachers
        ? "Selected teachers deleted successfully"
        : "Teacher deleted successfully",
    });
  };

  const columns = React.useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={
              table.getRowModel().rows.length > 0 &&
              table
                .getRowModel()
                .rows.every((row) =>
                  selectedTeachers.has(row.original.teacherId)
                )
            }
            onChange={(e) => handleSelectAll(e.target.checked, table)}
            className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
          />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()} className="relative z-20">
            <input
              type="checkbox"
              checked={selectedTeachers.has(row.original.teacherId)}
              onChange={(e) =>
                handleSelectTeacher(row.original.teacherId, e.target.checked)
              }
              className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: (info) => (
          <div className="flex items-center gap-x-2">
            <div>
              <Image
                src={info.row.original.photo}
                alt="Teacher Photo"
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover object-center"
              />
            </div>
            <div>
              <div>
                {info.row.original.firstName} {info.row.original.lastName} (
                {info.row.original.teacherId})
              </div>
              <div className="text-sm text-gray-400">
                {info.row.original.primaryPhone} ||{" "}
                {info.row.original.secondaryPhone}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("nidNumber", {
        header: "NID Number",
        cell: (info) => (
          <div>
            <div>{info.row.original.nidNumber}</div>
          </div>
        ),
      }),
      columnHelper.accessor("paymentType", {
        header: "Payment Type",
        cell: (info) => (
          <div>
            <div>
              {info.row.original.paymentType === "FIXED" ? "Fixed" : "Class"}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => (
          <div>
            <div>{info.row.original.address}</div>
          </div>
        ),
      }),
      columnHelper.accessor("teacherId", {
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-3 relative z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit(info.getValue());
              }}
              className="text-blue-500 hover:text-blue-400 text-2xl"
            >
              <FiEdit />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(info.row.original);
              }}
              className="text-red-500 hover:text-red-400 text-2xl"
            >
              <MdDelete />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper, selectedTeachers]
  ) as ColumnDef<ITeacher, unknown>[];

  const table = useReactTable({
    data: filteredTeachers,
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
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">All Teachers</h1>
            {selectedTeachers.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const teachersToDelete = filteredTeachers.filter(
                      (teacher) => selectedTeachers.has(teacher.teacherId)
                    );
                    handleDelete(teachersToDelete);
                  }}
                  className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full"
                >
                  Delete Selected ({selectedTeachers.size})
                </button>
                <button
                  onClick={() => setSelectedTeachers(new Set())}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300 border border-gray-400 hover:border-gray-300 rounded-full"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
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
            {table.getState().columnFilters.length > 0 && (
              <button
                onClick={() => {
                  table.resetColumnFilters();
                }}
                className="px-2 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="text-3xl text-gray-400 hover:text-white">
              <MdViewColumn />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-2">
                {table.getAllLeafColumns().map((column) => {
                  // Skip the actions column from toggle
                  if (column.id === "studentId") return null;

                  return (
                    <div key={column.id} className="flex items-center gap-x-2">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
                      />
                      <label className="text-sm">
                        {column.id === "firstName"
                          ? "Name"
                          : column.id === "sex"
                          ? "Gender"
                          : column.id.charAt(0).toUpperCase() +
                            column.id.slice(1)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </Menu.Items>
          </Menu>

          <Menu as="div" className="relative">
            <Menu.Button className="text-2xl text-gray-400 hover:text-white">
              <IoMdOptions />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-4">
                {/* Payment Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Type
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("paymentType")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("paymentType")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="FIXED">Fixed</option>
                    <option value="CLASS">Class</option>
                  </select>
                </div>

                {/* Class Filter */}
                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Class
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("class")?.getFilterValue() as string) ??
                      ""
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
                </div> */}

                {/* Sex Filter */}
                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
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
                </div> */}

                {/* Institute Filter */}
                {/* <div>
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
                      table
                        .getColumn("institute")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.institute.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-4">No teachers found</div>
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
                className="border-t border-gray-700 hover:bg-gray-800 relative group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4 relative">
                    {cell.column.id === "studentId" ? (
                      <div className="relative z-10">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Link
                          href={`/teachers/${row.original.teacherId}`}
                          className="absolute inset-0 z-0"
                          aria-label={`View details for ${row.original.firstName} ${row.original.lastName}`}
                        />
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    )}
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
        onClose={() =>
          setDeletePopup({
            isOpen: false,
            teacher: null,
            multipleTeachers: null,
          })
        }
        onDelete={confirmDelete}
        itemName={
          deletePopup.multipleTeachers
            ? `Selected teachers`
            : `${deletePopup.teacher?.firstName} ${deletePopup.teacher?.lastName}`
        }
      />

      <SuccessPopup
        isOpen={successPopup.isOpen}
        onClose={() => setSuccessPopup({ isOpen: false, message: "" })}
        message={successPopup.message}
      />
    </div>
  );
};

export default AllTeachersComponent;
