import type { Expense } from './Expense'

export interface ExpenseLineChartProps {
  expenses: Expense[]
  fromDate: string
  toDate: string
}
