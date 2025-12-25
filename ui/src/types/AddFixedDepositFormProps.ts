import type { UseFormReturn } from "react-hook-form";
import type { Account } from "./Account";
import type { Profile } from "./Profile";

export interface AddFixedDepositFormProps {
    form: UseFormReturn<{
        fixedDepositName: string;
        fixedDepositPrincipal: number;
        fixedDepositInterestRate: number;
        fixedDepositYears: string;
        fixedDepositMonths: string;
        fixedDepositDays: string;
        accountName: string;
        profileName: string;
        fixedDepositStartDate: Date;
        fixedDepositId?: number | undefined;
    }, any, {
        fixedDepositName: string;
        fixedDepositPrincipal: number;
        fixedDepositInterestRate: number;
        fixedDepositYears: string;
        fixedDepositMonths: string;
        fixedDepositDays: string;
        accountName: string;
        profileName: string;
        fixedDepositStartDate: Date;
        fixedDepositId?: number | undefined;
    }>;
    fixedDepositDialogOpen: boolean;
    setFixedDepositDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (formData: {
        fixedDepositName: string;
        fixedDepositPrincipal: number;
        fixedDepositInterestRate: number;
        fixedDepositYears: string;
        fixedDepositMonths: string;
        fixedDepositDays: string;
        accountName: string;
        profileName: string;
        fixedDepositStartDate: Date;
        fixedDepositId?: number | undefined;
    }) => Promise<void>;
    accounts: Array<Account>
    profiles: Array<Profile>
}