import type { SubmitHandler, UseFormReturn } from "react-hook-form"

export interface AddCategoryFormProps {
  form: UseFormReturn<{
    name: string
    colorCode: string
    id?: number | undefined
    description?: string | undefined
    icon?: string | undefined
    tags?: string[] | undefined
  }, any, {
    name: string
    colorCode: string
    id?: number | undefined
    description?: string | undefined
    icon?: string | undefined
    tags?: string[] | undefined
  }>
  categoryDialogOpen: boolean
  setCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: SubmitHandler<{ name: string, colorCode: string, id?: number | undefined, description?: string | undefined, icon?: string | undefined, tags?: string[] | undefined }>
}