import { useApiError } from '@/hooks/use-api-error'
import {
    useDeleteProfileMutation,
    useGetAllProfilesForUserQuery,
    useSaveProfileMutation,
    useUpdateProfileMutation,
} from '@/services/profilesApi'
import type { Profile } from '@/types/Profile'
import { defaultProfile } from '@/utilities/constants'
import { profileFormSchema } from '@/utilities/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

export function useProfilesFeature() {
    const [isUpdate, setIsUpdate] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false)
  const [deleteProfileDialogOpen, setDeleteProfileDialogOpen]
    = useState<boolean>(false)
  const [currentProfile, setCurrentProfile] = useState<Profile | undefined>()
  const [profileSearchText, setProfileSearchText] = useState('')

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onSubmit',
    defaultValues: defaultProfile,
  })

  const profilesQuery = useGetAllProfilesForUserQuery()
  const [saveProfile, saveProfileState]
    = useSaveProfileMutation()
  const [updateProfile, updateProfileState]
    = useUpdateProfileMutation()
  const [deleteProfile, deleteProfileState]
    = useDeleteProfileMutation()

  const { isError, errorComponent } = useApiError(profilesQuery.error);
  const isLoading = profilesQuery.isLoading
    || profilesQuery.isFetching
    || saveProfileState.isLoading
    || updateProfileState.isLoading
    || deleteProfileState.isLoading;

  const profiles = useMemo(() => {
    if (!profilesQuery.data)
      return undefined

    if (!profileSearchText)
      return profilesQuery.data;

    const search = profileSearchText.toLowerCase()

    return profilesQuery.data.filter(profile =>
      profile.profileName.toLowerCase().includes(search),
    )
  }, [profilesQuery.data, profileSearchText]);

  return {
    isUpdate,
    setIsUpdate,
    profileDialogOpen,
    setProfileDialogOpen,
    deleteProfileDialogOpen,
    setDeleteProfileDialogOpen,
    currentProfile,
    setCurrentProfile,
    setProfileSearchText,
    form,
    profiles,
    saveProfile,
    updateProfile,
    deleteProfile,
    isError,
    errorComponent,
    isLoading,
  };
};