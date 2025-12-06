import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import { AddProfileForm } from "@/components/building-blocks/forms/addProfileForm";
import { ProfileSection } from "@/components/building-blocks/profileSection";
import { Spinner } from "@/components/ui/spinner";
import { TabsContent } from "@/components/ui/tabs";
import { useApiError } from "@/hooks/use-api-error";
import {
  useDeleteProfileMutation,
  useGetAllProfilesForUserQuery,
  useSaveProfileMutation,
  useUpdateProfileMutation,
} from "@/services/profilesApi";
import type { Profile } from "@/types/Profile";
import { profileFormSchema } from "@/utilities/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function ProfilesSection() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [deleteProfileDialogOpen, setDeleteProfileDialogOpen] =
    useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | undefined>();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    mode: "onSubmit",
    defaultValues: {
      profileName: "",
      colorCode: "#000000",
      description: "",
      profilePicture: undefined,
    },
  });

  const {
    error,
    isLoading: getAllProfilesLoading,
    data,
  } = useGetAllProfilesForUserQuery();
  const [saveProfile, { isLoading: saveProfileLoading }] =
    useSaveProfileMutation();
  const [updateProfile, { isLoading: updateProfileLoading }] =
    useUpdateProfileMutation();
  const [deleteProfile, { isLoading: deleteProfileLoading }] =
    useDeleteProfileMutation();
  const { isError, errorComponent } = useApiError(error);

  if (
    getAllProfilesLoading ||
    saveProfileLoading ||
    updateProfileLoading ||
    deleteProfileLoading
  ) {
    return <Spinner />;
  }

  if (isError) {
    return errorComponent;
  }

  async function onSubmit(formData: z.infer<typeof profileFormSchema>) {
    if (isUpdate) {
      await updateExistingProfile(formData);
    } else if (!isUpdate) {
      await saveNewProfile(formData);
    } else {
      toast.error("Unknown action, try again");
    }
  }

  async function saveNewProfile(formData: z.infer<typeof profileFormSchema>) {
    try {
      const result = await saveProfile({ ...formData }).unwrap();

      toast("Profile saved!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Profile name:
              {result.profileName}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setProfileDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Profile already exists with name: ${formData.profileName}`,
        );
      } else if (error.originalStatus === 400) {
        toast.error("Invalid input. Please check your details.");
      } else if (error.originalStatus === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else if (error.originalStatus === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else {
        toast.error("Failed to create profile, please try again");
      }
    }
  }

  async function updateExistingProfile(
    formData: z.infer<typeof profileFormSchema>,
  ) {
    try {
      const result = await updateProfile({ ...formData }).unwrap();

      if (!result) {
        toast.error("Failed to update profile, please try again later");
        return;
      }

      toast("Profile updated!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Profile name:
              {result.profileName}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setIsUpdate(false);
      setProfileDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Profile already exists with name: ${formData.profileName}`,
        );
      } else if (error.originalStatus === 400) {
        toast.error("Invalid input. Please check your details.");
      } else if (error.originalStatus === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else if (error.originalStatus === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else {
        toast.error("Failed to create profile, please try again");
      }
    }
  }

  const cancelProfileCategory = () => {
    setDeleteProfileDialogOpen(false);
  };

  const deleteCurrentCategory = async () => {
    if (currentProfile && currentProfile.id) {
      await deleteProfile(currentProfile.id);
      toast.info(
        `Profile : ${currentProfile.profileName} deleted successfully!`,
      );
      setDeleteProfileDialogOpen(false);
    } else {
      toast.error("Invalid category! Please refresh the page");
    }
  };

  const handleDeleteProfile = (profile: Profile) => {
    setDeleteProfileDialogOpen(true);
    setCurrentProfile(profile);
  };

  return (
    <TabsContent value="profiles">
      <div className="space-y-4 mt-2">
        {data ? (
          data.map((profile) => (
            <ProfileSection
              profile={profile}
              key={profile.id}
              form={form}
              setIsUpdate={setIsUpdate}
              setProfileDialogOpen={setProfileDialogOpen}
              handleDeleteProfile={handleDeleteProfile}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Create a new profile here
          </p>
        )}
        <AddProfileForm
          form={form}
          onSubmit={onSubmit}
          profileDialogOpen={profileDialogOpen}
          setProfileDialogOpen={setProfileDialogOpen}
        />
      </div>
      <AlertDialogComponent
        isDialogOpen={deleteProfileDialogOpen}
        alertType="DELETE_PROFILE"
        onSecondaryButtonClick={cancelProfileCategory}
        onPrimaryButtonClick={deleteCurrentCategory}
      />
    </TabsContent>
  );
}
