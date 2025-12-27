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
    return errorComponent
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
      const profile = profiles?.find(
        profile => profile.profileName === formData.profileName,
      )
      if (!profile) {
        toast.error('Invalid data found, refresh and try again')
        return
      }

      const result = await saveCategory({
        ...formData,
        profileId: profile.profileId,
      }).unwrap()

      toast('Category saved!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Category name:
              {result.categoryName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setCategoryDialogOpen(false)
    }
    catch (error: any) {
      if (error.status) {
              showApiErrorToast(error, 'Failed to update account')
            }
    }
  }

  async function updateExistingCategory(
    formData: z.infer<typeof categoryFormSchema>,
  ) {
    try {
      const profile = profiles?.find(
        profile => profile.profileName === formData.profileName,
      )
      if (!profile) {
        toast.error('Invalid data found, refresh and try again')
        return
      }
      const result = await updateCategory({
        ...formData,
        profileId: profile.profileId,
      }).unwrap()

      if (!result) {
        toast.error('Failed to update category, please try again later')
        return
      }

      toast('Category updated!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Category name:
              {result.categoryName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setIsUpdate(false)
      setCategoryDialogOpen(false)
    }
    catch (error: any) {
      if (error?.status === 409) {
        toast.error(
          `Category already exists with name: ${formData.categoryName}`,
        )
      }
      else if (error.status === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.status === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else if (error.status === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else {
        toast.error('Failed to update category, please try again')
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
