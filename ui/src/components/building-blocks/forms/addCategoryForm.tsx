import type { AddCategoryFormProps } from "@/types/AddCategoryFormProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { IconsComboBox } from "@/components/building-blocks/iconsComboBox";
import { Badge } from "@/components/ui/badge";
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { defaultCategory } from "@/utilities/constants";

export function AddCategoryForm({
  form,
  categoryDialogOpen,
  setCategoryDialogOpen,
  onSubmit,
  setIsUpdate,
  isUpdate,
  profiles,
}: AddCategoryFormProps) {
  const [inputValue, setInputValue] = useState("");

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <Dialog open={categoryDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setCategoryDialogOpen(true);
            setIsUpdate(false);
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onClickMethod={() => {
          setCategoryDialogOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Use this form to create categories
        </DialogDescription>
        <form
          id="form-rhf-category"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <FieldGroup>
            <Controller
              name="categoryName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-category-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-category-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter category name"
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
                  <FieldLabel htmlFor="form-rhf-category-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-category-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter category description"
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
                  <FieldLabel htmlFor="form-rhf-category-color">
                    Color
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-category-color"
                    aria-invalid={fieldState.invalid}
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    {...field}
                    id="form-rhf-category-colorCode"
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
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="form-rhf-category-icon">Icon</FieldLabel>
                  <FieldDescription>
                    Select an icon for the category
                  </FieldDescription>
                  <IconsComboBox
                    field={field}
                    fieldState={fieldState}
                    form={form}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="profileName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-account-type">
                      Profile
                    </FieldLabel>
                    <FieldDescription>Choose your profile</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isUpdate === true}
                  >
                    <SelectTrigger
                      id="form-rhf-select-profile"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {profiles.map((profile) => (
                        <SelectItem
                          key={profile.id}
                          value={profile.profileName}
                        >
                          {profile.profileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-category-tags">Tags</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-category-tags"
                    aria-invalid={fieldState.invalid}
                    placeholder="Press 'ENTER' after adding each tag"
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputValue.trim() !== "") {
                        const tags = form.getValues("tags");
                        if (tags) {
                          form.setValue("tags", [...tags, inputValue.trim()]);
                        } else {
                          form.setValue("tags", [inputValue.trim()]);
                        }
                        setInputValue("");
                      }
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("tags") ? (
                      form.getValues("tags")?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-destructive"
                            onClick={() => {
                              const tags = form.getValues("tags");
                              if (tags) {
                                const newTags = tags.filter(
                                  (_tag) => _tag !== tag,
                                );
                                form.setValue("tags", [...newTags]);
                              }
                            }}
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultCategory)}
              >
                Reset
              </Button>
              <Button form="form-rhf-category">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
