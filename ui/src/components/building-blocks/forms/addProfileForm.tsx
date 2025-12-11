import type { AddProfileFormProps } from "@/types/AddProfileFormProps";
import { PlusCircle } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { defaultProfile } from "@/utilities/constants";

export function AddProfileForm({
  profileDialogOpen,
  setProfileDialogOpen,
  form,
  onSubmit,
}: AddProfileFormProps) {
  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <Dialog open={profileDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setProfileDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Profile
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onClickMethod={() => setProfileDialogOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
        </DialogHeader>
        <DialogDescription>Use this form to create profiles</DialogDescription>
        <form
          id="form-rhf-profile"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
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
              name="profileDescription"
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
              name="profileColorCode"
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
              name="profilePictureFile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-profile-picture">
                    Picture
                  </FieldLabel>
                  <Input
                    id="form-rhf-profile-picture"
                    type="file"
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultProfile)}
              >
                Reset
              </Button>
              <Button form="form-rhf-profile">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
