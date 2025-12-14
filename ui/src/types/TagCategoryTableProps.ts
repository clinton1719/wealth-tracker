import type { TagExpense } from './TagExpense'

export interface TagCategoryTableProps {
  tagExpenses: TagExpense[]
  fromDate: string
  toDate: string
  totalExpense: number
}
