import type { UseFormReturn } from "react-hook-form";
import type { Category } from "./Category";
import type { Profile } from "./Profile";

export interface CategorySectionProps {
  category: Category;
  profile: Profile;
  handleDeleteCategory: (category: Category) => void;
  form: UseFormReturn<{
    categoryName: string;
    colorCode: string;
    profileName: string;
    id?: number | undefined;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
  }, any, {
    categoryName: string;
    colorCode: string;
    profileName: string;
    id?: number | undefined;
    description?: string | undefined;
    icon?: string | undefined;
    tags?: string[] | undefined;
  }>;
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
