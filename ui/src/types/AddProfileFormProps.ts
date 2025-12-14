import type { UseFormReturn } from 'react-hook-form'

export interface AddProfileFormProps {
  profileDialogOpen: boolean
  setProfileDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  form: UseFormReturn<
    {
      profileName: string
      profileColorCode: string
      profileId?: number | undefined
      profileDescription?: string | undefined
      profilePicture?: string
      profilePictureFile?: File
    },
    any,
    {
      profileName: string
      profileColorCode: string
      profileId?: number | undefined
      profileDescription?: string | undefined
      profilePicture?: string
      profilePictureFile?: File
    }
  >
  onSubmit: any
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
