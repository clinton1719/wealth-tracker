import type { Category } from './Category'
import type { Expense } from './Expense'

export interface ExpenseSummaryCardsProps {
  expensesData: Expense[]
  categoriesData: Category[]
}
