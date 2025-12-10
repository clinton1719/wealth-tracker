import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { Profile } from "./Profile";

export interface AddCategoryFormProps {
  form: UseFormReturn<
    {
      categoryName: string;
      colorCode: string;
      categoryId?: number | undefined;
      categoryDescription?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      categoryTags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      colorCode: string;
      categoryId?: number | undefined;
      categoryDescription?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      categoryTags?: string[] | undefined;
    }
  >;
  categoryDialogOpen: boolean;
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: SubmitHandler<{
    categoryName: string;
    colorCode: string;
    categoryId?: number | undefined;
    categoryDescription?: string | undefined;
    categoryIcon?: string | undefined;
    profileName: string;
    categoryTags?: string[] | undefined;
  }>;
  isUpdate: boolean;
  profiles: Profile[];
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
