import { useApiError } from "@/hooks/use-api-error";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import type { Profile } from "@/types/Profile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Switch } from "@radix-ui/react-switch";
import { TabsContent } from "@radix-ui/react-tabs";
import { DynamicIcon } from "lucide-react/dynamic";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function ProfilesSection() {
    const { error, isLoading: getAllProfilesLoading, data } = useGetAllProfilesForUserQuery();
    const { isError, errorComponent } = useApiError(error);

    if (getAllProfilesLoading) {
        return <Spinner />;
    }

    if (isError) {
        return errorComponent;
    }

    return (
        <TabsContent value="profiles">
            <div className="space-y-4 mt-2">
                {data ? data.map(profile => <ProfileSection profile={profile} />) : <></>}
                <Button variant="outline">Add Profile</Button>
            </div>
        </TabsContent>
    );
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