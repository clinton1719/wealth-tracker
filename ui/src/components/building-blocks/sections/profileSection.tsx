import type { Profile } from '@/types/Profile'
import type { ProfileSectionProps } from '@/types/ProfileSectionProps'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDispatch, useSelector } from 'react-redux'
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
      className="card"
      style={{ backgroundColor: `${profile.profileColorCode}70` }}
    >
      <CardHeader>
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.profileColorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span className="card-title">{profile.profileName}</span>
            <span className="description">{profile.profileDescription}</span>
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
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span
              className={`status-badge ${enabledMap[profile.profileId] ? 'enabled' : 'disabled'
              }`}
            >
              {enabledMap[profile.profileId] ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              id={`profile-${profile.profileId}`}
              checked={enabledMap[profile.profileId]}
              onCheckedChange={() => dispatch(toggleProfile(profile.profileId))}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  )
}
