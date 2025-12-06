import { type UseFormReturn } from 'react-hook-form'
import type { Profile } from './Profile';

export interface ProfileSectionProps {
  profile: Profile;
  form: UseFormReturn<{
    profileName: string;
    colorCode: string;
    id?: number | undefined;
    description?: string | undefined;
    profilePicture?: string | undefined;
    profilePictureFile?: File | undefined;
}, any, {
    profileName: string;
    colorCode: string;
    id?: number | undefined;
    description?: string | undefined;
    profilePicture?: string | undefined;
    profilePictureFile?: File | undefined;
}>;
  setProfileDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteProfile: (profile: Profile) => void;
}