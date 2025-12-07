import type { UseFormReturn } from "react-hook-form";
import type { Profile } from "./Profile";

export interface AddAccountFormProps {
    profiles: Profile[];
    accountDialogOpen: boolean;
    setAccountDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    form: UseFormReturn<{
        accountName: string;
        accountBalance: number;
        accountType: string;
        profileName: string;
        id?: number | undefined;
        description?: string | undefined;
    }, any, {
        accountName: string;
        accountBalance: number;
        accountType: string;
        profileName: string;
        id?: number | undefined;
        description?: string | undefined;
    }>
    onSubmit: any;
}
