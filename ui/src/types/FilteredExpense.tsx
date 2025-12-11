export interface FilteredExpense {
  expenseId: number
  expenseAmount: number
  expenseDescription: string
  expenseCreatedAt: string
  categoryId: number | undefined
  categoryName: string | undefined
  categoryIcon: string | undefined
  categoryColorCode: string | undefined
  accountName: string | undefined
  profileName: string | undefined
}
