import type { UseFormReturn } from 'react-hook-form'
import type { Category } from './Category'
import type { Profile } from './Profile'

export interface CategorySectionProps {
  category: Category
  profile: Profile
  handleDeleteCategory: (category: Category) => void
  form: UseFormReturn<{
    categoryName: string
    categoryColorCode: string
    profileName: string
    categoryId?: number | undefined
    categoryDescription?: string | undefined
    categoryIcon?: string | undefined
    categoryTags?: string[] | undefined
  }, any, {
    categoryName: string
    categoryColorCode: string
    profileName: string
    categoryId?: number | undefined
    categoryDescription?: string | undefined
    categoryIcon?: string | undefined
    categoryTags?: string[] | undefined
  }>
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
