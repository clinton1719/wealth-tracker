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
import { Label } from "../ui/label";
import { Card } from "../ui/card";

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
    <Card
      className="flex flex-row items-center justify-between p-4 shadow-sm border rounded-xl"
      style={{ backgroundColor: `${profile.colorCode}15` }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">

        <ProfilePicture
          imageSource={profile.profilePicture}
          fallbackName={profile.profileName.charAt(0)}
          imageColor={profile.colorCode}
        />

        <div className="flex flex-col min-w-0">
          <span className="text-lg font-semibold leading-none tracking-tight truncate">
            {profile.profileName}
          </span>

          <span className="text-muted-foreground text-sm truncate">
            {profile.description ?? "No description"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">

        <div className="flex items-center gap-2">
          <Switch
            id={`profile-${profile.id}`}
            checked={enabledMap[profile.id]}
            onCheckedChange={() => dispatch(toggleProfile(profile.id))}
          />
          <Label
            htmlFor={`profile-${profile.id}`}
            className="text-sm font-medium whitespace-nowrap"
          >
            {enabledMap[profile.id] ? "Enabled" : "Disabled"}
          </Label>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
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
      </div>
    </Card>
  );
}
