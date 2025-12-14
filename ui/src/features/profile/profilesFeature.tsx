import type * as z from 'zod'
import type { Profile } from '@/types/Profile'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddProfileForm } from '@/components/building-blocks/forms/addProfileForm'
import { ProfileSection } from '@/components/building-blocks/sections/profileSection'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useApiError } from '@/hooks/use-api-error'
import {
  useDeleteProfileMutation,
  useGetAllProfilesForUserQuery,
  useSaveProfileMutation,
  useUpdateProfileMutation,
} from '@/services/profilesApi'
import { defaultProfile } from '@/utilities/constants'
import { profileFormSchema } from '@/utilities/zodSchemas'

export function ProfilesFeature() {
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

  const {
    error,
    isLoading: getAllProfilesLoading,
    isFetching: getAllProfilesFetching,
    data: profileData,
  } = useGetAllProfilesForUserQuery()
  const [saveProfile, { isLoading: saveProfileLoading }]
    = useSaveProfileMutation()
  const [updateProfile, { isLoading: updateProfileLoading }]
    = useUpdateProfileMutation()
  const [deleteProfile, { isLoading: deleteProfileLoading }]
    = useDeleteProfileMutation()
  const { isError, errorComponent } = useApiError(error)

  const filteredProfileData = React.useMemo(() => {
    if (!profileData)
      return undefined

    if (!profileSearchText)
      return profileData

    const search = profileSearchText.toLowerCase()

    return profileData.filter(profile =>
      profile.profileName.toLowerCase().includes(search),
    )
  }, [profileData, profileSearchText])

  if (
    getAllProfilesLoading
    || getAllProfilesFetching
    || saveProfileLoading
    || updateProfileLoading
    || deleteProfileLoading
  ) {
    return <Spinner className="spinner" />
  }

  if (isError) {
    return errorComponent
  }

  async function onSubmit(formData: z.infer<typeof profileFormSchema>) {
    if (isUpdate) {
      await updateExistingProfile(formData)
    }
    else if (!isUpdate) {
      await saveNewProfile(formData)
    }
    else {
      toast.error('Unknown action, try again')
    }
  }

  async function saveNewProfile(formData: z.infer<typeof profileFormSchema>) {
    try {
      const result = await saveProfile({ ...formData }).unwrap()

      toast('Profile saved!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Profile name:
              {result.profileName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setProfileDialogOpen(false)
    }
    catch (error: any) {
      if (error?.status === 409) {
        toast.error(
          `Profile already exists with name: ${formData.profileName}`,
        )
      }
      else if (error.status === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.status === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else if (error.status === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else {
        toast.error('Failed to create profile, please try again')
      }
    }
  }

  async function updateExistingProfile(
    formData: z.infer<typeof profileFormSchema>,
  ) {
    try {
      const updatedFormData = {
        ...formData,
        profilePicture: undefined,
      }
      const result = await updateProfile({ ...updatedFormData }).unwrap()

      if (!result) {
        toast.error('Failed to update profile, please try again later')
        return
      }

      toast('Profile updated!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Profile name:
              {result.profileName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setIsUpdate(false)
      setProfileDialogOpen(false)
    }
    catch (error: any) {
      if (error?.status === 409) {
        toast.error(
          `Profile already exists with name: ${formData.profileName}`,
        )
      }
      else if (error.status === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.status === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else if (error.status === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else {
        toast.error('Failed to update profile, please try again')
      }
    }
  }

  const cancelDeleteProfile = () => {
    setDeleteProfileDialogOpen(false)
  }

  const deleteCurrentProfile = async () => {
    if (currentProfile && currentProfile.profileId) {
      await deleteProfile(currentProfile.profileId).unwrap()
      toast.info(
        `Profile : ${currentProfile.profileName} deleted successfully!`,
      )
      setDeleteProfileDialogOpen(false)
    }
    else {
      toast.error('Invalid profile! Please refresh the page')
    }
  }

  const handleDeleteProfile = (profile: Profile) => {
    setDeleteProfileDialogOpen(true)
    setCurrentProfile(profile)
  }

  return (
    <div id="profilesSection">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Profiles</h1>
        <Input
          type="search"
          placeholder="Search profiles by name..."
          className="search-bar"
          onChange={e => setProfileSearchText(e.target.value)}
        />
        <AddProfileForm
          form={form}
          onSubmit={onSubmit}
          profileDialogOpen={profileDialogOpen}
          setProfileDialogOpen={setProfileDialogOpen}
          setIsUpdate={setIsUpdate}
        />
      </div>
      <div className="normal-grid">
        {filteredProfileData
          ? (
              filteredProfileData.map(profile => (
                <ProfileSection
                  profile={profile}
                  key={profile.profileId}
                  form={form}
                  setIsUpdate={setIsUpdate}
                  setProfileDialogOpen={setProfileDialogOpen}
                  handleDeleteProfile={handleDeleteProfile}
                />
              ))
            )
          : (
              <p className="text-muted-foreground text-sm">
                Create a new profile here
              </p>
            )}
      </div>
      <AlertDialogComponent
        isDialogOpen={deleteProfileDialogOpen}
        alertType="DELETE_PROFILE"
        onSecondaryButtonClick={cancelDeleteProfile}
        onPrimaryButtonClick={deleteCurrentProfile}
      />
    </div>
  )
}
