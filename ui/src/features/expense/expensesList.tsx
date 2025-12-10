import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ExpensesListProps } from "@/types/ExpensesListProps"
import type { FilteredExpense } from "@/types/FilteredExpense"
import { formatCurrency } from "@/utilities/helper"
import { DynamicIcon } from "lucide-react/dynamic"

export const columns: ColumnDef<FilteredExpense>[] = [
  {
    accessorKey: "expenseAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{ marginLeft: "-1em" }}
        >
          Amount
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const formattedAmount = formatCurrency(row.getValue("amount"))

      return <div className="text-left font-medium">{formattedAmount}</div>
    },
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{ marginLeft: "-1em" }}
        >
          Category name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left flex gap-2">
      <DynamicIcon
        name={row.getValue("categoryIcon") ? row.getValue("categoryIcon") : ("badge-check" as any)}
        color={row.getValue("categoryColorCode")}
      />
      {row.getValue("categoryName")}</div>,
  },
  {
    accessorKey: "categoryIcon",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          style={{ marginLeft: "-1em" }}
        >
          Category name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left flex gap-2">
      {row.getValue("categoryIcon")}</div>,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit expense</DropdownMenuItem>
            <DropdownMenuItem>Delete expense</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ExpensesList({ expensesData, accountsData, categoriesData, profilesData }: ExpensesListProps) {
  const categoryMap = React.useMemo(() => Object.fromEntries(
    categoriesData.map(c => [c.categoryId, c])
  ), [categoriesData]);

  const accountMap = React.useMemo(() => Object.fromEntries(
    accountsData.map(a => [a.accountId, a])
  ), [accountsData]);

  const profileMap = React.useMemo(() => Object.fromEntries(
    profilesData.map(p => [p.profileId, p])
  ), [profilesData]);

  const filteredExpensesData = React.useMemo(() => {
    console.log(categoriesData)
    return expensesData.map(expense => ({
      expenseId: expense.expenseId,
      expenseAmount: expense.expenseAmount,
      expenseCreatedAt: expense.expenseCreatedAt,
      expenseUpdatedAt: expense.expenseUpdatedAt,
      expenseDescription: expense.expenseDescription,
      categoryName: categoryMap[expense.categoryId]?.categoryName,
      categoryIcon: categoryMap[expense.categoryId]?.categoryIcon,
      categoryColorCode: categoryMap[expense.categoryId]?.categoryColorCode,
      account: accountMap[expense.accountId],
      profile: profileMap[expense.profileId]
    }));
  }, [expensesData, categoryMap, accountMap, profileMap]);


  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: filteredExpensesData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by description..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
