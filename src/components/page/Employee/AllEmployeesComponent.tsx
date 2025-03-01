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
import { Gender, PaymentMethod } from "@/enums/common.enum";
import { IEmployee } from "@/types/employee";
import { searchEmployee } from "@/utils/search/employeeSearch";
import { EmployeeType } from "@/enums/employees.enum";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstCharacter";
import { toast } from "react-toastify";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

const DEFAULT_VISIBLE_COLUMNS = {
  name: true,
  employeeType: true,
  primaryPhone: true,
  nidNumber: false,
  presentAddress: true,
  permanentAddress: false,
  paymentMethod: false,
  isDirector: false,
};

const AllEmployeesComponent = () => {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    employee: IEmployee | null;
    multipleEmployees: IEmployee[] | null;
  }>({ isOpen: false, employee: null, multipleEmployees: null });
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_VISIBLE_COLUMNS
  );
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [allEmployeesList, setAllEmployeesList] = useState<IEmployee[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const columnHelper = createColumnHelper<IEmployee>();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/employees`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setAllEmployeesList(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter students based on search query
  const filteredEmployees = React.useMemo(() => {
    if (!allEmployeesList) return [];
    return allEmployeesList.filter((employee) => {
      if (!searchQuery?.trim()) return true;
      return searchEmployee(employee as IEmployee, searchQuery);
    });
  }, [searchQuery, allEmployeesList]);

  const handleEdit = useCallback(
    (employeeId: string) => {
      router.push(`/employees/edit/${employeeId}`);
    },
    [router]
  );

  const handleSelectAll = useCallback(
    (checked: boolean, table: Table<IEmployee>) => {
      if (checked) {
        const allIds = table
          .getRowModel()
          .rows.map((row) => row.original.employeeId);
        setSelectedEmployees(new Set(allIds));
      } else {
        setSelectedEmployees(new Set());
      }
    },
    []
  );

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleDelete = (employees: IEmployee | IEmployee[]) => {
    if (Array.isArray(employees)) {
      setDeletePopup({
        isOpen: true,
        employee: null,
        multipleEmployees: employees,
      });
    } else {
      setDeletePopup({
        isOpen: true,
        employee: employees,
        multipleEmployees: null,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      if (deletePopup.multipleEmployees) {
        // Delete multiple employees
        const employeeIds = deletePopup.multipleEmployees.map(
          (e) => e.employeeId
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/employees/bulk-delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeIds),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete employees");
        }

        // Update the employees list after successful deletion
        const updatedEmployees = allEmployeesList?.filter(
          (employee) => !employeeIds.includes(employee.employeeId)
        );

        setAllEmployeesList(updatedEmployees || null);
        setSelectedEmployees(new Set());
        toast.success(data.message || "Employees deleted successfully");
      } else if (deletePopup.employee) {
        // Delete single employee
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/employees/${deletePopup.employee.employeeId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete employee");
        }

        // Update the employees list after successful deletion
        const updatedEmployees = allEmployeesList?.filter(
          (employee) => employee.employeeId !== deletePopup.employee?.employeeId
        );

        setAllEmployeesList(updatedEmployees || null);
        toast.success(data.message || "Employee deleted successfully");
      }

      setDeletePopup({
        isOpen: false,
        employee: null,
        multipleEmployees: null,
      });
    } catch (error) {
      console.error("Error deleting employee(s):", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete employee"
      );
      setDeletePopup({
        isOpen: false,
        employee: null,
        multipleEmployees: null,
      });
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
                  selectedEmployees.has(row.original.employeeId)
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
              checked={selectedEmployees.has(row.original.employeeId)}
              onChange={(e) =>
                handleSelectEmployee(row.original.employeeId, e.target.checked)
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
              <div>
                {info.row.original.firstName} {info.row.original.lastName} (
                {info.row.original.employeeId})
              </div>
              <div className="text-sm text-gray-400">
                {info.row.original.primaryPhone}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("father", {
        header: "Parents Information",
        cell: (info) => (
          <>
            <div>
              <div>
                {info.row.original.father?.name || "-"}{" "}
                <span className="text-gray-400">
                  {info.row.original.father?.phone
                    ? `(${info.row.original.father.phone})`
                    : ""}
                </span>
              </div>
            </div>
            <div>
              <div>
                {info.row.original.mother?.name || "-"}{" "}
                <span className="text-gray-400">
                  {info.row.original.mother?.phone
                    ? `(${info.row.original.mother.phone})`
                    : ""}
                </span>
              </div>
            </div>
          </>
        ),
      }),
      columnHelper.accessor("nidNumber", {
        header: "NID Number",
        cell: (info) => (
          <div>
            <div>{info.row.original.nidNumber || "-"}</div>
          </div>
        ),
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Payment Type",
        cell: (info) => (
          <div>
            <div>
              {info.row.original.paymentMethod === PaymentMethod.PerClass
                ? `Class ($${info.row.original.paymentPerClass})`
                : `Monthly ($${info.row.original.paymentPerMonth || "-"})`}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("presentAddress", {
        header: "Present Address",
        cell: (info) => (
          <div>
            <div>{info.row.original.presentAddress || "-"}</div>
          </div>
        ),
      }),
      columnHelper.accessor("permanentAddress", {
        header: "Permanent Address",
        cell: (info) => (
          <div>
            <div>{info.row.original.permanentAddress || "-"}</div>
          </div>
        ),
      }),
      columnHelper.accessor("employeeType", {
        header: "Type",
        cell: (info) => (
          <div className="flex items-center gap-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${
                info.row.original.employeeType === EmployeeType.TEACHER
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {capitalizeFirstLetter(info.row.original.employeeType)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("isDirector", {
        header: "Director Status",
        cell: (info) => (
          <div>
            {info.row.original.isDirector ? (
              <span className="text-green-600">Director</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("employeeId", {
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-3 relative z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit(info.row.original.employeeId);
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
    [columnHelper, selectedEmployees]
  ) as ColumnDef<IEmployee, unknown>[];

  const table = useReactTable({
    data: filteredEmployees,
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
            <h1 className="text-lg font-semibold">All Employees</h1>
            {selectedEmployees.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const employeesToDelete = filteredEmployees.filter(
                      (employee) => selectedEmployees.has(employee.employeeId)
                    );
                    handleDelete(employeesToDelete as IEmployee[]);
                  }}
                  className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-full"
                >
                  Delete Selected ({selectedEmployees.size})
                </button>
                <button
                  onClick={() => setSelectedEmployees(new Set())}
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
              if (filter.id === "gender") {
                displayValue = filter.value === Gender.Male ? "Male" : "Female";
              } else if (filter.id === "paymentMethod") {
                switch (filter.value) {
                  case PaymentMethod.PerClass:
                    displayValue = "Class";
                    break;
                  case PaymentMethod.Monthly:
                    displayValue = "Monthly";
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
          <Link
            href="/employees/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Add Employee
          </Link>

          <Menu as="div" className="relative">
            <Menu.Button className="text-3xl text-gray-400 hover:text-white">
              <MdViewColumn />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg p-2 z-50">
              <div className="space-y-2">
                {table.getAllLeafColumns().map((column) => {
                  // Skip the actions column from toggle
                  if (column.id === "employeeId") return null;

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
                          : column.id === "paymentMethod"
                          ? "Payment Method"
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
                {/* payment method */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Method
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("paymentMethod")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("paymentMethod")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value={PaymentMethod.PerClass}>Class</option>
                    <option value={PaymentMethod.Monthly}>Monthly</option>
                  </select>
                </div>

                {/* employee type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee Type
                  </label>
                  <select
                    className="w-full bg-gray-700 rounded p-1 text-sm"
                    value={
                      (table
                        .getColumn("employeeType")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) =>
                      table
                        .getColumn("employeeType")
                        ?.setFilterValue(e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value={EmployeeType.TEACHER}>Teacher</option>
                    <option value={EmployeeType.CLEANER}>Cleaner</option>
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
          <div className="mt-2">Loading employees...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">
            Error loading employees
          </div>
          <div className="text-gray-400">{error.message}</div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-2">No employee found</div>
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
                    {cell.column.id === "employeeId" ? (
                      <div className="relative z-10">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Link
                          href={`/employees/${row.original.employeeId}`}
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
            employee: null,
            multipleEmployees: null,
          })
        }
        onDelete={confirmDelete}
        itemName={
          deletePopup.multipleEmployees
            ? `Confirm`
            : `${deletePopup.employee?.firstName} ${deletePopup.employee?.lastName}`
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

export default AllEmployeesComponent;
