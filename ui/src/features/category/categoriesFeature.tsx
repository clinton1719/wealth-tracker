import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddCategoryForm } from '@/components/building-blocks/forms/addCategoryForm'
import { CategorySection } from '@/components/building-blocks/sections/categorySection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useCategoriesFeature } from '@/hooks/useCategoriesFeature'
import type { Category } from '@/types/Category'
import { showApiErrorToast } from '@/utilities/apiErrorToast'
import { resolveProfileId } from '@/utilities/helper'
import { categoryFormSchema } from '@/utilities/zodSchemas'
import { Fragment } from 'react'
import { toast } from 'sonner'
import type * as z from 'zod'

export default function CategoriesFeature() {
  const {
    isUpdate,
    setIsUpdate,
    deleteCategoryDialogOpen,
    setDeleteCategoryDialogOpen,
    currentCategory,
    setCurrentCategory,
    categoryDialogOpen,
    setCategoryDialogOpen,
    setCategorySearchText,
    selectedTag,
    setSelectedTag,
    form,
    categories,
    tags,
    saveCategory,
    updateCategory,
    deleteCategory,
    isError,
    errorComponent,
    isLoading, profiles
  } = useCategoriesFeature();

  if (
    isLoading
  ) {
    return <Spinner className="spinner" />
  }

  if (isError) {
    return errorComponent()
  }

  async function onSubmit(formData: z.infer<typeof categoryFormSchema>) {
    if (isUpdate) {
      await updateExistingCategory(formData)
    }
    else if (!isUpdate) {
      await saveNewCategory(formData)
    }
    else {
      toast.error('Unknown action, try again')
    }
  }

  async function saveNewCategory(formData: z.infer<typeof categoryFormSchema>) {
    try {
      if (profiles) {
        const profileId = resolveProfileId(profiles, formData.profileName);

        const result = await saveCategory({
          ...formData,
          profileId,
        }).unwrap()

        toast.success(`Category ${result.categoryName} saved!`)

        setCategoryDialogOpen(false)
      } else {
        toast.error('Invalid data found, refresh and try again')
        return
      }
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to update account');
      }
    }
  }

  async function updateExistingCategory(
    formData: z.infer<typeof categoryFormSchema>,
  ) {
    try {
      if (profiles) {
        const profileId = resolveProfileId(profiles, formData.profileName);
        const result = await updateCategory({
          ...formData,
          profileId,
        }).unwrap();

        toast.success(`Category ${result.categoryName} updated!`)

        setIsUpdate(false)
        setCategoryDialogOpen(false)
      }

    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to update account');
      }
    }
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategoryDialogOpen(true)
    setCurrentCategory(category)
  }

  const cancelDeleteCategory = () => {
    setDeleteCategoryDialogOpen(false)
  }

  const deleteCurrentCategory = async () => {
    if (currentCategory && currentCategory.categoryId) {
      await deleteCategory(currentCategory.categoryId).unwrap()
      toast.info(
        `Category : ${currentCategory.categoryName} deleted successfully!`,
      )
      setDeleteCategoryDialogOpen(false)
    }
    else {
      toast.error('Invalid category! Please refresh the page')
    }
  }

  if (categories && profiles) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading1">Categories</h1>
          <div className="flex gap-2 min-w-lg">
            <Input
              type="search"
              placeholder="Search categories by name..."
              className="search-bar"
              onChange={e => setCategorySearchText(e.target.value)}
            />
            {tags
              ? (
                <>
                  <Select
                    value={selectedTag}
                    onValueChange={e => setSelectedTag(e)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tags</SelectLabel>
                        {tags.map((tag) => {
                          return (
                            <SelectItem key={tag} value={tag ?? ''}>
                              {tag}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedTag('')}
                  >
                    Clear tags
                  </Button>
                </>
              )
              : (
                <></>
              )}
          </div>
          <AddCategoryForm
            form={form}
            categoryDialogOpen={categoryDialogOpen}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setCategoryDialogOpen={setCategoryDialogOpen}
            onSubmit={onSubmit}
            profiles={profiles}
          />
        </div>

        <div className="normal-grid">
          {categories
            .map((category) => {
              const profile = profiles.find(
                profile => profile.profileId === category.profileId,
              )
              if (profile) {
                return (
                  <CategorySection
                    key={category.categoryId}
                    category={category}
                    handleDeleteCategory={handleDeleteCategory}
                    profile={profile}
                    form={form}
                    setCategoryDialogOpen={setCategoryDialogOpen}
                    setIsUpdate={setIsUpdate}
                  />
                )
              }
              else {
                return (
                  <Fragment key={category.categoryId}>
                  </Fragment>
                )
              }
            })}
        </div>
        <AlertDialogComponent
          isDialogOpen={deleteCategoryDialogOpen}
          alertType="DELETE_CATEGORY"
          onSecondaryButtonClick={cancelDeleteCategory}
          onPrimaryButtonClick={deleteCurrentCategory}
        />
      </div>
    )
  }
}
