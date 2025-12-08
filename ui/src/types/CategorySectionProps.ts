import type { Category } from "./Category";

export interface CategorySectionProps {
  category: Category;
  handleUpdateCategory: (category: Category) => void;
  handleDeleteCategory: (category: Category) => void;
}
