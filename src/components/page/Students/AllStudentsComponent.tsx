"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { IStudent } from "@/types/student";
import { useSearch } from "@/context/SearchContext";
import { searchStudent } from "@/utils/search/studentSearch";
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
import { Gender } from "@/enums/common.enum";
import { toast } from "react-toastify";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const DEFAULT_VISIBLE_COLUMNS = {
  name: true,
  class: true,
  father: true,
  mother: true,
  admissionDate: false,
  referrer: true,
  gender: false,
  instituteName: false,
  studentId: true,
};

const AllStudentsComponent = () => {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    student: IStudent | null;
    multipleStudents: IStudent[] | null;
  }>({ isOpen: false, student: null, multipleStudents: null });
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  const [allStudentsList, setAllStudentsList] = useState<IStudent[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/students`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setAllStudentsList(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columnHelper = createColumnHelper<IStudent>();

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    if (!allStudentsList) return [];
    return allStudentsList.filter((student: IStudent) => {
      if (!searchQuery?.trim()) return true;
      return searchStudent(student, searchQuery);
    });
  }, [searchQuery, allStudentsList]);

  // Get unique values for filters
  const uniqueValues = React.useMemo(() => {
    if (!allStudentsList) return { class: [], gender: [], instituteName: [] };
    return {
      class: Array.from(
        new Set(allStudentsList.map((student: IStudent) => student.class))
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
      gender: Array.from(
        new Set(allStudentsList.map((student: IStudent) => student.gender))
      )
        .sort()
        .reverse(),
      instituteName: Array.from(
        new Set(
          allStudentsList.map((student: IStudent) => student.instituteName)
        )
      )
        .sort()
        .reverse(),
    };
  }, [allStudentsList]);

  const handleEdit = useCallback(
    (studentId: string) => {
      router.push(`/students/edit/${studentId}`);
    },
    [router]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = table
        .getRowModel()
        .rows.map((row) => row.original.studentId);
      setSelectedStudents(new Set(allIds));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleDelete = (students: IStudent | IStudent[]) => {
    if (Array.isArray(students)) {
      setDeletePopup({
        isOpen: true,
        student: null,
        multipleStudents: students,
      });
    } else {
      setDeletePopup({
        isOpen: true,
        student: students,
        multipleStudents: null,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      if (deletePopup.multipleStudents) {
        // Delete multiple students
        const studentIds = deletePopup.multipleStudents.map((s) => s.studentId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/students/bulk-delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentIds),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete students");
        }

        // Update the students list after successful deletion
        const updatedStudents = allStudentsList?.filter(
          (student) => !studentIds.includes(student.studentId)
        );

        setAllStudentsList(updatedStudents || null);
        setSelectedStudents(new Set());

        // Show success message with details if available
        const successMessage = data.details
          ? `Successfully deleted ${data.details.totalSuccess} students${
              data.details.totalFailed > 0
                ? ` (${data.details.totalFailed} failed)`
                : ""
            }`
          : data.message || "Students deleted successfully";

        toast.success(successMessage);

        // If there were any failures, show them in separate error toasts
        if (data.details?.failed?.length > 0) {
          data.details.failed.forEach(
            ({ id, reason }: { id: string; reason: string }) => {
              toast.error(`Failed to delete student ${id}: ${reason}`);
            }
          );
        }
      } else if (deletePopup.student) {
        // Delete single student
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/students/${deletePopup.student.studentId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete student");
        }

        // Update the students list after successful deletion
        const updatedStudents = allStudentsList?.filter(
          (student) => student.studentId !== deletePopup.student?.studentId
        );

        setAllStudentsList(updatedStudents || null);
        toast.success(data.message || "Student deleted successfully");
      }

      setDeletePopup({ isOpen: false, student: null, multipleStudents: null });
    } catch (error) {
      console.error("Error deleting student(s):", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete student(s)"
      );
      setDeletePopup({ isOpen: false, student: null, multipleStudents: null });
    }
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
                  selectedStudents.has(row.original.studentId)
                )
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
          />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()} className="relative z-20">
            <input
              type="checkbox"
              checked={selectedStudents.has(row.original.studentId)}
              onChange={(e) =>
                handleSelectStudent(row.original.studentId, e.target.checked)
              }
              className="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      }),

      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="flex items-center gap-x-2">
            {/* <div>
              <Image
                src={info.row.original.photo}
                alt="Student Photo"
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover object-center"
              />
            </div> */}
            <div>
              <div>
                {info.row.original.name} ({info.row.original.studentId})
              </div>
              <div className="text-sm text-gray-400">
                {info.row.original.phoneNumber}
              </div>
              <div className="text-sm text-gray-400">
                {info.row.original.instituteName}
              </div>
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
      columnHelper.accessor("gender", {
        header: "Gender",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return String(row.getValue(columnId)) === filterValue;
        },
        cell: (info) => {
          const genderValue = info.row.original.gender;
          switch (genderValue) {
            case Gender.Male:
              return "Male";
            case Gender.Female:
              return "Female";
            default:
              return genderValue;
          }
        },
        enableHiding: true,
      }),
      columnHelper.accessor("father", {
        header: "Father Name",
        cell: (info) => {
          const father = info.row.original.father;
          if (!father?.name && !father?.phone && !father?.occupation) {
            return <div>-</div>;
          }
          return (
            <div>
              <div>{father?.name}</div>
              <div className="text-sm text-gray-400">{father?.phone}</div>
              <div className="text-sm text-gray-400">{father?.occupation}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor("mother", {
        header: "Mother Name",
        cell: (info) => {
          const mother = info.row.original.mother;
          if (!mother?.name && !mother?.phone && !mother?.occupation) {
            return <div>-</div>;
          }
          return (
            <div>
              <div>{mother?.name}</div>
              <div className="text-sm text-gray-400">{mother?.phone}</div>
              <div className="text-sm text-gray-400">{mother?.occupation}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor("admissionDate", {
        header: "Admission Date",
        cell: (info) => {
          if (!info.getValue()) return "-";
          const date = new Date(info.getValue() as string);
          return date
            .toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/(\d+)/, (match) => {
              const day = parseInt(match);
              return `${day}`;
            });
        },
      }),
      columnHelper.accessor("referredBy", {
        header: "Referrer",
        cell: (info) => {
          const referredBy = info.row.original.referredBy;
          if (!referredBy?.name && !referredBy?.phone) {
            return <div>-</div>;
          }
          return (
            <div>
              <div>{referredBy?.name}</div>
              <div className="text-sm text-gray-400">{referredBy?.phone}</div>
            </div>
          );
        },
      }),

      columnHelper.accessor("instituteName", {
        header: "Institute",
        enableColumnFilter: true,
        cell: (info) => info.getValue() || "-",
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
    [columnHelper, selectedStudents]
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
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">All Students</h1>
            {selectedStudents.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const studentsToDelete = filteredStudents.filter(
                      (student: IStudent) =>
                        selectedStudents.has(student.studentId)
                    );
                    handleDelete(studentsToDelete);
                  }}
                  className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full"
                >
                  Delete Selected ({selectedStudents.size})
                </button>
                <button
                  onClick={() => setSelectedStudents(new Set())}
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
                        {column.id === "name"
                          ? "Name"
                          : column.id === "gender"
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
                {/* Class Filter */}
                <div>
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
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table.getColumn("gender")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(e) =>
                      table.getColumn("gender")?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.gender.map((value) => (
                      <option key={value} value={value}>
                        {value === Gender.Male ? "Male" : "Female"}
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
                        .getColumn("instituteName")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("instituteName")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {uniqueValues.instituteName.map((value) => (
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
      </div>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div className="mt-2">Loading students...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">
            Error loading students
          </div>
          <div className="text-gray-400">{error.message}</div>
        </div>
      ) : filteredStudents?.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-2">No student found</div>
          {searchQuery && (
            <div className="text-gray-500">
              Try adjusting your search or filters to find what you&apos;re
              looking for
            </div>
          )}
        </div>
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
                          href={`/students/${row.original.studentId}`}
                          className="absolute inset-0 z-0"
                          aria-label={`View details for ${row.original.name}`}
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
            student: null,
            multipleStudents: null,
          })
        }
        onDelete={confirmDelete}
        itemName={
          deletePopup.multipleStudents
            ? `Confirm`
            : `${deletePopup.student?.name}`
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

export default AllStudentsComponent;
