import type { Account } from "./Account";
import type { Category } from "./Category";
import type { Expense } from "./Expense";
import type { Profile } from "./Profile";

export interface ExpensesListProps {
    expensesData: Expense[];
    categoriesData: Category[];
    accountsData: Account[];
    profilesData: Profile[];
}