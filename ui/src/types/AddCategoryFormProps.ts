import type { SubmitHandler, UseFormReturn } from "react-hook-form";

export interface AddCategoryFormProps {
  form: UseFormReturn<
    {
      categoryName: string;
      colorCode: string;
      id?: number | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      tags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      colorCode: string;
      id?: number | undefined;
      description?: string | undefined;
      icon?: string | undefined;
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
    tags?: string[] | undefined;
  }>;
}
