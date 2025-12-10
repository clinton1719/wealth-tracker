import type { Account } from "./Account";
import type { Profile } from "./Profile";

export interface FilteredExpense {
  expenseId: number;
  expenseAmount: number;
  expenseDescription: string;
  expenseCreatedAt: string;
  expenseUpdatedAt: string;
  categoryName: string | undefined;
  categoryIcon: string | undefined;
  categoryColorCode: string | undefined;
  account: Account | undefined;
  profile: Profile | undefined;
}
