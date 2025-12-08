import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { Profile } from "./Profile";

export interface AddCategoryFormProps {
  form: UseFormReturn<
    {
      categoryName: string;
      colorCode: string;
      id?: number | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      profileName: string;
      tags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      colorCode: string;
      id?: number | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      profileName: string;
      tags?: string[] | undefined;
    }
  >;
  categoryDialogOpen: boolean;
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: SubmitHandler<{
    categoryName: string;
    colorCode: string;
    id?: number | undefined;
    description?: string | undefined;
    icon?: string | undefined;
    profileName: string;
    tags?: string[] | undefined;
  }>;
  isUpdate: boolean;
  profiles: Profile[];
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
