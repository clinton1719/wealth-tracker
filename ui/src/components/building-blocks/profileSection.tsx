import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { Profile } from "@/types/Profile";
import type { ProfileSectionProps } from "@/types/ProfileSectionProps";
import { DynamicIcon } from "lucide-react/dynamic";
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

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg" style={{ backgroundColor: `${profile.colorCode}33` }}>
      <div className="flex items-center gap-3">
        <ProfilePicture
          imageSource={profile.profilePicture}
          fallbackName={profile.profileName.charAt(0)}
          imageColor={profile.colorCode}
        />
        <div className="flex flex-col">
          <span
            className="text-muted-foreground text-xl"
          >
            {profile.profileName}
          </span>
          <span className="text-sm text-muted-foreground mb-4 break-all">
            {profile.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center space-x-2 gap-4 mr-4">
          <Switch id="airplane-mode"/>
          <Label htmlFor="airplane-mode">Enabled</Label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <DynamicIcon name="edit" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white shadow-md"
            align="start"
          >
            <DropdownMenuItem onClick={() => handleUpdateProfile(profile)} style={{ cursor: 'pointer' }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteProfile(profile)} style={{ cursor: 'pointer' }}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
