import type { Account } from "./Account";
import type { Profile } from "./Profile";

export interface FilteredExpense {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  categoryName: string | undefined;
  categoryIcon: string | undefined;
  categoryColorCode: string | undefined;
  account: Account | undefined;
  profile: Profile | undefined;
}
