export interface UpdateExpense {
    categoryId: number;
    expenseId?: number | undefined;
    expenseAmount: number;
    expenseDescription?: string | undefined;
    categoryName: string;
    accountName: string;
    profileName: string;
}