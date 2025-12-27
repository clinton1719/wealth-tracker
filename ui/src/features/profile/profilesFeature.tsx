import type * as z from 'zod'
import type { Profile } from '@/types/Profile'
import type { profileFormSchema } from '@/utilities/zodSchemas'
import { toast } from 'sonner'
import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddProfileForm } from '@/components/building-blocks/forms/addProfileForm'
import { ProfileSection } from '@/components/building-blocks/sections/profileSection'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useProfilesFeature } from '@/hooks/useProfilesFeature'
import { showApiErrorToast } from '@/utilities/apiErrorToast'

export function ProfilesFeature() {
  const {
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
  } = useProfilesFeature()

  if (isLoading) {
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

      toast.success(`Profile ${result.profileName} saved!`)

      setProfileDialogOpen(false)
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to save profile!')
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

      toast.success(`Profile ${result.profileName} update!`)

      setIsUpdate(false)
      setProfileDialogOpen(false)
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to update profile!')
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
        {profiles
          ? (
              profiles.map(profile => (
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
