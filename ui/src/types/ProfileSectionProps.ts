import type { UseFormReturn } from 'react-hook-form'
import type { Profile } from './Profile'

export interface ProfileSectionProps {
  profile: Profile
  form: UseFormReturn<
    {
      profileName: string
      profileColorCode: string
      profileId?: number | undefined
      profileDescription?: string | undefined
      profilePicture?: string | undefined
      profilePictureFile?: File | undefined
    },
    any,
    {
      profileName: string
      profileColorCode: string
      profileId?: number | undefined
      profileDescription?: string | undefined
      profilePicture?: string | undefined
      profilePictureFile?: File | undefined
    }
  >
  setProfileDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteProfile: (profile: Profile) => void
}
