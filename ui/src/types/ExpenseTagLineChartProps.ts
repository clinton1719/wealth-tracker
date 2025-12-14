import type { MonthlyTagExpense } from './MonthlyTagExpense'

export interface ExpenseTagLineChartProps {
  monthlyTagExpenses: MonthlyTagExpense[]
  fromDate: string
  toDate: string
}
