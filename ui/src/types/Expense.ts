export interface Expense {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  accountId: number;
  profileId: number;
}
