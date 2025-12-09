import type { Account } from "./Account";
import type { Category } from "./Category";
import type { Profile } from "./Profile";

export interface FilteredExpense {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  account: Account;
  profile: Profile;
}
