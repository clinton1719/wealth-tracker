import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { Account } from "./Account";
import type { Category } from "./Category";
import type { Profile } from "./Profile";

export interface AddExpenseFormProps {
  expenseDialogOpen: boolean;
  setExpenseDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate: boolean;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<
    {
      expenseAmount: number;
      categoryName: string;
      accountName: string;
      profileName: string;
      expenseId?: number | undefined;
      expenseDescription?: string | undefined;
    },
    any,
    {
      expenseAmount: number;
      categoryName: string;
      accountName: string;
      profileName: string;
      expenseId?: number | undefined;
      expenseDescription?: string | undefined;
    }
  >;
  onSubmit: SubmitHandler<{
    expenseAmount: number;
    categoryName: string;
    accountName: string;
    profileName: string;
    expenseId?: number | undefined;
    expenseDescription?: string | undefined;
  }>;
  profiles: Profile[];
  accounts: Account[];
  categories: Category[];
}
