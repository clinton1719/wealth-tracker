export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryColorCode: string;
  categoryIcon?: string;
  categoryTags?: string[];
  profileId: number;
}
