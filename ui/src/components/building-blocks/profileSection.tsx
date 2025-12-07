import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { selectProfileSlice, toggleProfile } from "@/slices/profileSlice";
import type { Profile } from "@/types/Profile";
import type { ProfileSectionProps } from "@/types/ProfileSectionProps";
import { DynamicIcon } from "lucide-react/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

export function ProfileSection({
  profile,
  form,
  setProfileDialogOpen,
  setIsUpdate,
  handleDeleteProfile,
}: ProfileSectionProps) {
  const handleUpdateProfile = (profile: Profile) => {
    form.reset(profile);
    setProfileDialogOpen(true);
    setIsUpdate(true);
  };

  const dispatch = useDispatch();
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);

  return (
    <Card className="w-full max-w-sm" style={{ backgroundColor: `${profile.colorCode}40` }}>
      <CardHeader>
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.colorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span className="text-lg font-medium text-muted-foreground">{profile.profileName}</span>
            <span className="text-muted-foreground text-sm mt-1 whitespace-normal wrap-break-word">
              {profile.description}
            </span>
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
          <div className="flex justify-between">
            <Label htmlFor={`profile-${profile.id}`}> {enabledMap[profile.id] ? "Enabled" : "Disabled"}</Label>
            <Switch
              id={`profile-${profile.id}`}
              checked={enabledMap[profile.id]}
              onCheckedChange={() => dispatch(toggleProfile(profile.id))}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">

      </CardFooter>
    </Card>
  );
}
