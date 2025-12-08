import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { Profile } from "./Profile";
import type { Account } from "./Account";
import type { Category } from "./Category";

export interface AddExpenseFormProps {
    expenseDialogOpen: boolean;
    setExpenseDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate: boolean;
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    form: UseFormReturn<{
        amount: number;
        createdAt: string;
        updatedAt: string;
        categoryName: string;
        accountName: string;
        profileName: string;
        id?: number | undefined;
        description?: string | undefined;
    }, any, {
        amount: number;
        createdAt: string;
        updatedAt: string;
        categoryName: string;
        accountName: string;
        profileName: string;
        id?: number | undefined;
        description?: string | undefined;
    }>;
    onSubmit: SubmitHandler<{
        amount: number;
        createdAt: string;
        updatedAt: string;
        categoryName: string;
        accountName: string;
        profileName: string;
        id?: number | undefined;
        description?: string | undefined;
    }>;
    profiles: Profile[];
    accounts: Account[];
    categories: Category[];
}