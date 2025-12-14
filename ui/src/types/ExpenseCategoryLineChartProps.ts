import type { MonthlyCategoryExpense } from "./MonthlyCategoryExpense"

export interface ExpenseCategoryLineChartProps {
    monthlyCategoryExpenses: MonthlyCategoryExpense[]
    fromDate: string
    toDate: string
}