import { useApiError } from '@/hooks/use-api-error'
import { useGetAllProfilesForUserQuery, useSaveProfileMutation, useUpdateProfileMutation } from '@/services/profilesApi'
import type { Profile } from '@/types/Profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Switch } from '@radix-ui/react-switch'
import { TabsContent } from '@radix-ui/react-tabs'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { AddProfileForm } from './AddProfileForm'

const formSchema = z.object({
  id: z.number().optional(),
  profileName: z.string().min(1, 'Profile name is required'),
  description: z.string().max(100, 'Description must be at most 100 characters long').optional(),
  colorCode: z.string().min(4, 'Color code must be valid').max(7, 'Color code must be valid'),
  profilePicture: z.string().optional(),
})



export function ProfilesSection() {
  const { error, isLoading: getAllProfilesLoading, data } = useGetAllProfilesForUserQuery()
  const [saveProfile, { isLoading: saveProfileLoading }] = useSaveProfileMutation()
  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation()
  const { isError, errorComponent } = useApiError(error)
  const [isUpdate, setIsUpdate] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false)

  if (getAllProfilesLoading || saveProfileLoading || updateProfileLoading) {
    return <Spinner />
  }

  if (isError) {
    return errorComponent
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      profileName: '',
      colorCode: '#000000',
      description: '',
      profilePicture: '',
    },
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
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

  async function saveNewProfile(formData: z.infer<typeof formSchema>) {
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
      if (error?.originalStatus === 409) {
        toast.error(`Profile already exists with name: ${formData.profileName}`)
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else if (error.originalStatus === 403) {
        toast.error('Access denied. You do not have permission to access this resource.')
      }
      else {
        toast.error('Failed to create profile, please try again')
      }
    }
  }

  async function updateExistingProfile(formData: z.infer<typeof formSchema>) {
    try {
      const result = await updateProfile({ ...formData }).unwrap()

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
      if (error?.originalStatus === 409) {
        toast.error(`Profile already exists with name: ${formData.profileName}`)
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 403) {
        toast.error('Access denied. You do not have permission to access this resource.')
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else {
        toast.error('Failed to create profile, please try again')
      }
    }
  }

  return (
    <TabsContent value="profiles">
      <div className="space-y-4 mt-2">
        {data ? data.map(profile => <ProfileSection profile={profile} key={profile.id} />) : <></>}
        <AddProfileForm form={form} onSubmit={onSubmit} profileDialogOpen={profileDialogOpen} setProfileDialogOpen={setProfileDialogOpen} />
      </div>
    </TabsContent>
  )
}

function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="rounded-full h-full w-full object-cover" />
          <AvatarFallback
            style={{ color: 'white' }}
            className="rounded-full h-full w-full text-lg"
          >
            {profile.profileName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span>{profile.profileName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={true} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <DynamicIcon name="shield-x" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

interface ProfileSectionProps {
  profile: Profile
}
