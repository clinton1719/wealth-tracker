import { useApiError } from "@/hooks/use-api-error";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import type { Profile } from "@/types/Profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Switch } from "@radix-ui/react-switch";
import { TabsContent } from "@radix-ui/react-tabs";
import { PlusCircle } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
    id: z.number().optional(),
    profileName: z.string().min(1, "Profile name is required"),
    description: z.string().max(100, "Description must be at most 100 characters long").optional(),
    colorCode: z.string().min(4, "Color code must be valid").max(7, "Color code must be valid"),
    profilePicture: z.string().optional(),
});


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
                <AddProfileForm />
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

function AddProfileForm() {
    const [isUpdate, setIsUpdate] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            profileName: "",
            colorCode: "#000000",
            description: "",
            profilePicture: ""
        },
    });

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        if (isUpdate) {
            // await updateExistingprofile(formData);
        } else if (!isUpdate) {
            // await saveNewProfile(formData);
        } else {
            toast.error("Unknown action, try again");
        }
    }

    const checkKeyDown = (e: any) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    return (<Dialog open={profileDialogOpen}>
        <DialogTrigger asChild>
            <Button onClick={() => { setProfileDialogOpen(true) }}>
                <PlusCircle className="mr-2 h-5 w-5" />
                New Category
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md" onClickMethod={() => setProfileDialogOpen(false)}>
            <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Use this form to create categories
            </DialogDescription>
            <form id="form-rhf-profile" onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
                <FieldGroup>
                    <Controller
                        name="profileName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-profile-name">
                                    Profile name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-profile-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter profile name"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-profile-description">
                                    Description
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-profile-description"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter profile description"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="colorCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-profile-color">
                                    Color
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-profile-color"
                                    aria-invalid={fieldState.invalid}
                                    type="color"
                                    className="w-12 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                    {...field}
                                    id="form-rhf-profile-colorCode"
                                    aria-invalid={fieldState.invalid}
                                    className="flex-1"
                                    placeholder="#FF5733"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="profilePicture"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-profile-picture">
                                    Picture
                                </FieldLabel>
                                <Input id="form-rhf-profilePicture" type="file" {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button form="form-rhf-profile">
                            Submit
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </DialogContent>
    </Dialog>)
}