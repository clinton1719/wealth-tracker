import { ProfilePicture } from '@/components/building-blocks/profilePicture'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { selectProfileSlice, toggleProfile } from '@/slices/profileSlice'
import type { Profile } from '@/types/Profile'
import type { ProfileSectionProps } from '@/types/ProfileSectionProps'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../ui/card'

export function ProfileSection({
  profile,
  form,
  setProfileDialogOpen,
  setIsUpdate,
  handleDeleteProfile,
}: ProfileSectionProps) {
  const handleUpdateProfile = (profile: Profile) => {
    form.reset({
      ...profile,
      profileDescription: profile.profileDescription ?? '',
    })
    setProfileDialogOpen(true)
    setIsUpdate(true)
  }

  const dispatch = useDispatch()
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)

  return (
    <Card
      className='card card-border'
      style={{ borderColor: profile.profileColorCode }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.profileColorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span className="heading4">{profile.profileName}</span>
          </div>
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted rounded-full"
              >
                <DynamicIcon name="ellipsis-vertical" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                onClick={() => handleUpdateProfile(profile)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProfile(profile)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {profile.profileDescription ? (<div>
            <p className="text-muted-foreground">Description</p>
            <p className="font-medium">{profile.profileDescription}</p>
          </div>) : null}

          <div>
            <span
              className={`${enabledMap[profile.profileId] ? 'enabled' : 'disabled'
                }`}
            >
              {enabledMap[profile.profileId] ? 'Enabled' : 'Disabled'}
            </span>

            <Switch
              id={`profile-${profile.profileId}`}
              checked={enabledMap[profile.profileId]}
              onCheckedChange={() => dispatch(toggleProfile(profile.profileId))}
              className='ml-1'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
