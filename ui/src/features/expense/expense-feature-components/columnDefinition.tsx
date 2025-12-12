import type { ColumnDef } from '@tanstack/react-table'
import type { FilteredExpense } from '@/types/FilteredExpense'

import type { UpdateExpense } from '@/types/UpdateExpense'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { ProfilePicture } from '@/components/building-blocks/profilePicture'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/utilities/helper'
import { DataTableFilter } from './dataTableFilter'

export function createColumns(
  handleUpdateProfile: (updateExpense: UpdateExpense) => void,
  handleDeleteAccount: (expenseId: Partial<FilteredExpense>) => void,
): ColumnDef<FilteredExpense>[] {
  return [
    {
      accessorKey: 'expenseAmount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            style={{ marginLeft: '-1em' }}
          >
            Amount
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const formattedAmount = formatCurrency(row.getValue('expenseAmount'))

        return <div className="text-left font-medium">{formattedAmount}</div>
      },
    },
    {
      accessorKey: 'categoryName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            style={{ marginLeft: '-1em' }}
          >
            Category name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div
          className="text-left flex gap-2"
          style={{ color: row.getValue('categoryColorCode') }}
        >
          <DynamicIcon
            name={
              row.getValue('categoryIcon')
                ? row.getValue('categoryIcon')
                : ('badge-check' as any)
            }
            color={row.getValue('categoryColorCode')}
          />
          {row.getValue('categoryName')}
        </div>
      ),
    },
    {
      accessorKey: 'expenseDescription',
      header: () => <div className="text-left">Description</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('expenseDescription')}</div>
      ),
    },
    {
      accessorKey: 'expenseCreatedAt',
      header: () => <div className="text-left">Created at</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('expenseCreatedAt')}</div>
      ),
    },
    {
      accessorKey: 'accountName',
      header: ({ column }) => {
        return (
          <div className="text-left">
            <DataTableFilter column={column} title="Account name" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('accountName')}</div>
      ),
      filterFn: 'arrIncludes',
    },
    {
      accessorKey: 'profileName',
      header: ({ column }) => {
        return (
          <div className="text-left">
            <DataTableFilter column={column} title="Profile name" />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-left flex items-center gap-2">
          <ProfilePicture
            imageSource={row.getValue('profilePicture')}
            fallbackName={(row.getValue('profileName') as string).charAt(0)}
            imageColor={row.getValue('profileColorCode')}
          />
          {row.getValue('profileName')}
        </div>
      ),
      filterFn: 'arrIncludes',
    },
    {
      accessorKey: 'categoryColorCode',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      accessorKey: 'categoryIcon',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      accessorKey: 'expenseId',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      accessorKey: 'categoryId',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      accessorKey: 'profilePicture',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      accessorKey: 'profileColorCode',
      enableHiding: false,
      header: () => null,
      cell: () => null,
      size: 0,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  handleUpdateProfile({
                    expenseAmount: row.getValue('expenseAmount'),
                    expenseDescription: row.getValue('expenseDescription'),
                    expenseId: row.getValue('expenseId'),
                    categoryId: row.getValue('categoryId'),
                    categoryName: row.getValue('categoryName'),
                    accountName: row.getValue('accountName'),
                    profileName: row.getValue('profileName'),
                  })
                }}
              >
                Edit expense
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteAccount({
                    expenseId: row.getValue('expenseId'),
                    expenseAmount: row.getValue('expenseAmount'),
                    expenseCreatedAt: row.getValue('expenseCreatedAt'),
                  })
                }}
              >
                Delete expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
