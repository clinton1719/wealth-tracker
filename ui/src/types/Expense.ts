export interface Expense {
  expenseId: number
  expenseAmount: number
  expenseDescription: string
  expenseCreatedAt: string
  expenseUpdatedAt: string
  categoryId: number
  accountId: number
  profileId: number
}
