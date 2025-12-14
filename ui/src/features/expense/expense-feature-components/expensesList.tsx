import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { ExpensesListProps } from '@/types/ExpensesListProps'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createColumns } from './columnDefinition'

export function ExpensesList({
  expensesData,
  accountsData,
  categoriesData,
  profilesData,
  handleUpdateExpense,
  handleDeleteExpense,
}: ExpensesListProps) {
  const categoryMap = React.useMemo(() => {
    if (!categoriesData)
      return {}
    return Object.fromEntries(categoriesData.map(c => [c.categoryId, c]))
  }, [categoriesData])

  const accountMap = React.useMemo(() => {
    if (!accountsData)
      return {}
    return Object.fromEntries(accountsData.map(a => [a.accountId, a]))
  }, [accountsData])

  const profileMap = React.useMemo(() => {
    if (!profilesData)
      return {}
    return Object.fromEntries(profilesData.map(p => [p.profileId, p]))
  }, [profilesData])

  const filteredExpensesData = React.useMemo(() => {
    return expensesData
      .map(expense => ({
        expenseId: expense.expenseId,
        expenseAmount: expense.expenseAmount,
        expenseCreatedAt: expense.expenseCreatedAt,
        expenseDescription: expense.expenseDescription,
        categoryId: categoryMap[expense.categoryId]?.categoryId,
        categoryName: categoryMap[expense.categoryId]?.categoryName,
        categoryIcon: categoryMap[expense.categoryId]?.categoryIcon,
        categoryColorCode: categoryMap[expense.categoryId]?.categoryColorCode,
        accountName: accountMap[expense.accountId].accountName,
        profileName: profileMap[expense.profileId].profileName,
        profilePicture: profileMap[expense.profileId].profilePicture,
        profileColorCode: profileMap[expense.profileId].profileColorCode,
      }))
  }, [expensesData, categoryMap, accountMap, profileMap])

  const columns = React.useMemo(
    () => createColumns(handleUpdateExpense, handleDeleteExpense),
    [handleUpdateExpense, handleDeleteExpense],
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility]
    = React.useState<VisibilityState>({ accountName: false, profileName: false })

  /* eslint-disable react-hooks/incompatible-library */
  const table = useReactTable({
    data: filteredExpensesData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: row => row.expenseId.toString(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })
  /* eslint-enable react-hooks/incompatible-library */

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by description..."
          value={
            (table
              .getColumn('expenseDescription')
              ?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table
              .getColumn('expenseDescription')
              ?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
              {' '}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value =>
                      column.toggleVisibility(!!value)}
                  >
                    {column.id.replace('expense', '').replace('Name', ' name')}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      style={{
                        borderLeft: `6px solid ${row.getValue('profileColorCode') ?? undefined}`,
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
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
    </div>
  )
}
