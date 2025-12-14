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
import type { TagCategoryTableProps } from "@/types/TagCategoryTableProps"
import { formatCurrency } from "@/utilities/helper"

export function TagCategoryTable({ tagExpenses, fromDate, toDate, totalExpense }: TagCategoryTableProps) {
    return (
        <Table>
            <TableCaption>Expenses per tag from {fromDate} to {toDate}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Expense amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tagExpenses.map((tagExpense) => (
                    <TableRow key={tagExpense.tag} style={{ borderLeft: `6px solid ${tagExpense.profileColorCode}`, }}>
                        <TableCell className="flex gap-4">
                            {tagExpense.tag}
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(tagExpense.expenseAmount)}</TableCell>
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
