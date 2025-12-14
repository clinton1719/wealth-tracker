import type { CategoryExpense } from './CategoryExpense'

export interface ExpenseCategoryPieProps {
  categoryExpenses: CategoryExpense[]
  fromDate: string
  toDate: string
}
