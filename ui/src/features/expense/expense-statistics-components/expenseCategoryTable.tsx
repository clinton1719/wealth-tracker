import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { ExpenseCategoryTableProps } from "@/types/ExpenseCategoryTableProps"
import { formatCurrency } from "@/utilities/helper"
import { DynamicIcon } from "lucide-react/dynamic"
import { Fragment } from "react/jsx-runtime"

export function ExpenseCategoryTable({ categoryExpenses, fromDate, toDate, totalExpense }: ExpenseCategoryTableProps) {
    return (
        <Table>
            <TableCaption>Expenses per category from {fromDate} to {toDate}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Expense amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categoryExpenses.map((categoryExpense) => (
                    <TableRow key={categoryExpense.categoryName}>
                        <TableCell className="font-medium flex gap-4" style={{ color: categoryExpense.categoryColorCode }}>
                            {categoryExpense.categoryIcon ? (<DynamicIcon
                                name={
                                    categoryExpense.categoryIcon ?
                                        categoryExpense.categoryIcon :
                                        ('badge-check' as any)
                                }
                                color={categoryExpense.categoryColorCode}
                            />) : <Fragment></Fragment>}
                            {categoryExpense.categoryName}
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(categoryExpense.expenseAmount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={1}>Total</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalExpense)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
