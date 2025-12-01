import type { UseFormReturn } from "react-hook-form";

export interface AddProfileFormProps {
    profileDialogOpen: boolean;
    setProfileDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    form: UseFormReturn<{
        profileName: string;
        colorCode: string;
        id?: number | undefined;
        description?: string | undefined;
        profilePicture?: string;
        profilePictureFile?: File;
    }, any, {
        profileName: string;
        colorCode: string;
        id?: number | undefined;
        description?: string | undefined;
        profilePicture?: string;
        profilePictureFile?: File;
    }>
    onSubmit: any
}