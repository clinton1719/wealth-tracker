import {
    type Column,
    type ColumnDef
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { FilteredExpense } from "@/types/FilteredExpense"
import { formatCurrency } from "@/utilities/helper"
import { DynamicIcon } from "lucide-react/dynamic"

interface DataTableFilterProps<TData> {
    column: Column<TData, unknown>
    title: string
}


function DataTableFilter<TData>({ column, title }: DataTableFilterProps<TData>) {
    const options = Array.from(column.getFacetedUniqueValues()?.keys() || []) as string[]
    const filterValue = column.getFilterValue() as string[] | undefined

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-1 h-8 data-[state=open]:bg-accent"
                >
                    {title}
                    {filterValue && filterValue.length > 0 && (
                        <span className="ml-1 text-xs font-bold opacity-70">
                            ({filterValue.length})
                        </span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
                {filterValue && filterValue.length > 0 && (
                    <DropdownMenuItem onClick={() => column.setFilterValue(undefined)} className="text-red-500">
                        Clear Filter
                    </DropdownMenuItem>
                )}

                {options.map((option) => {
                    const isSelected = filterValue?.includes(option)

                    return (
                        <DropdownMenuCheckboxItem
                            key={option}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                let newFilterValue = filterValue ? [...filterValue] : [];

                                if (checked) {
                                    newFilterValue.push(option);
                                } else {
                                    newFilterValue = newFilterValue.filter((val) => val !== option);
                                }
                                column.setFilterValue(newFilterValue.length > 0 ? newFilterValue : undefined);
                            }}
                        >
                            {option}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const createColumns = (
    handleUpdateProfile: any
): ColumnDef<FilteredExpense>[] => [
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
                const formattedAmount = formatCurrency(row.getValue("expenseAmount"))

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
            cell: ({ row }) => <div className="text-left flex gap-2" style={{ color: row.getValue("categoryColorCode") }}>
                <DynamicIcon
                    name={row.getValue("categoryIcon") ? row.getValue("categoryIcon") : ("badge-check" as any)}
                    color={row.getValue("categoryColorCode")}
                />
                {row.getValue("categoryName")}</div>,
        },
        {
            accessorKey: "expenseDescription",
            header: () => <div className="text-left">Description</div>,
            cell: ({ row }) => <div className="text-left">{row.getValue("expenseDescription")}</div>,
        },
        {
            accessorKey: "expenseCreatedAt",
            header: () => <div className="text-left">Created at</div>,
            cell: ({ row }) => <div className="text-left">{row.getValue("expenseCreatedAt")}</div>,
        },
        {
            accessorKey: "accountName",
            header: ({ column }) => {
                return (
                    <div className="text-left">
                        <DataTableFilter column={column} title="Account name" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-left">{row.getValue("accountName")}</div>,
            filterFn: "arrIncludes",
        },
        {
            accessorKey: "profileName",
            header: ({ column }) => {
                return (
                    <div className="text-left">
                        <DataTableFilter column={column} title="Profile name" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-left">{row.getValue("profileName")}</div>,
            filterFn: "arrIncludes",
        },
        {
            accessorKey: "categoryColorCode",
            enableHiding: false,
            header: () => null,
            cell: () => null,
            size: 0,
        },
        {
            accessorKey: "categoryIcon",
            enableHiding: false,
            header: () => null,
            cell: () => null,
            size: 0,
        },
        {
            accessorKey: "expenseId",
            enableHiding: false,
            header: () => null,
            cell: () => null,
            size: 0,
        },
        {
            accessorKey: "categoryId",
            enableHiding: false,
            header: () => null,
            cell: () => null,
            size: 0,
        },
        {
            id: "actions",
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
                            <DropdownMenuItem onClick={() => {
                                handleUpdateProfile({
                                    expenseAmount: row.getValue("expenseAmount"),
                                    expenseDescription: row.getValue("expenseDescription"),
                                    expenseId: row.getValue("expenseId"),
                                    categoryId: row.getValue("categoryId"),
                                    categoryName: row.getValue("categoryName"),
                                    accountName: row.getValue("accountName"),
                                    profileName: row.getValue("profileName"),
                                })
                            }}>Edit expense</DropdownMenuItem>
                            <DropdownMenuItem>Delete expense</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                )
            },
        },
    ]