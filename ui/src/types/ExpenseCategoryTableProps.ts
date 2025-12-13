import type { CategoryExpense } from "./CategoryExpense";

export interface ExpenseCategoryTableProps{
    categoryExpenses: CategoryExpense[];
    fromDate: string;
    toDate: string;
    totalExpense: number;
}