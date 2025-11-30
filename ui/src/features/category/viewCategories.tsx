
import { AddCategoryForm } from '@/components/building-blocks/addCategoryForm'
import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { ProfilePicture } from '@/components/building-blocks/profilePicture'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useApiError } from '@/hooks/use-api-error'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery, useSaveCategoryMutation, useUpdateCategoryMutation } from '@/services/categoriesApi'
import type { Category } from '@/types/Category'
import { zodResolver } from '@hookform/resolvers/zod'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().max(100, 'Description must be at most 100 characters long').optional(),
  colorCode: z.string().min(4, 'Color code must be valid').max(7, 'Color code must be valid'),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
})


export default function ViewCategories() {
  const [isUpdate, setIsUpdate] = useState(false)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState<boolean>(false)
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>()
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      colorCode: '#000000',
      icon: '',
      tags: [],
    },
  })

  const [saveCategory, { isLoading: saveCategoryLoading }] = useSaveCategoryMutation()
  const [updateCategory, { isLoading: updateCategoryLoading }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: deleteCategoryLoading }] = useDeleteCategoryMutation()
  const { error, isLoading: getAllCategoriesLoading, data } = useGetAllCategoriesQuery()
  const { isError, errorComponent } = useApiError(error)

  if (saveCategoryLoading || getAllCategoriesLoading || updateCategoryLoading || deleteCategoryLoading) {
    return <Spinner />
  }

  if (isError) {
    return errorComponent
  }

  async function onSubmit(formData: z.infer<typeof formSchema>) {
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

  async function saveNewCategory(formData: z.infer<typeof formSchema>) {
    try {
      const result = await saveCategory({ ...formData }).unwrap()

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
              {result.name}
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
      if (error?.originalStatus === 409) {
        toast.error(`Category already exists with name: ${formData.name}`)
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else if (error.originalStatus === 403) {
        toast.error('Access denied. You do not have permission to access this resource.')
      }
      else {
        toast.error('Failed to create category, please try again')
      }
    }
  }

  async function updateExistingCategory(formData: z.infer<typeof formSchema>) {
    try {
      const result = await updateCategory({ ...formData }).unwrap()

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
              {result.name}
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
      if (error?.originalStatus === 409) {
        toast.error(`Category already exists with name: ${formData.name}`)
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 403) {
        toast.error('Access denied. You do not have permission to access this resource.')
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else {
        toast.error('Failed to create category, please try again')
      }
    }
  }

  const handleUpdateCategory = (category: Category) => {
    form.reset(category)
    setCategoryDialogOpen(true)
    setIsUpdate(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategoryDialogOpen(true)
    setCurrentCategory(category)
  }

  const cancelDeleteCategory = () => {
    setDeleteCategoryDialogOpen(false)
  }

  const deleteCurrentCategory = async () => {
    if (currentCategory && currentCategory.id) {
      await deleteCategory(currentCategory.id)
      toast.info(`Category : ${currentCategory.name} deleted successfully!`)
      setDeleteCategoryDialogOpen(false)
    }
    else {
      toast.error('Invalid category! Please refresh the page')
    }
  }

  if (data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <AddCategoryForm form={form} categoryDialogOpen={categoryDialogOpen} setCategoryDialogOpen={setCategoryDialogOpen} onSubmit={onSubmit} />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map(category => (
            <Card key={category.id} className="hover:shadow-md transition flex justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 break-all">
                  <DynamicIcon name={category.icon ? category.icon : 'badge-check' as any} color={category.colorCode} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorCode }} />
                  {category.name}
                </CardTitle>
                <ProfilePicture imageSource={""} fallbackName={""} imageColor={""} />
              </CardHeader>
              <CardContent className="mb-2">
                <p className="text-sm text-muted-foreground mb-4 break-all">{category.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {category.tags?.map(tag => (
                    <Badge key={tag} variant="outline" style={{ color: category.colorCode }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex-row gap-2 justify-between">
                <Button variant="ghost" onClick={() => handleUpdateCategory(category)}>
                  <DynamicIcon name="edit" color={category.colorCode} className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDeleteCategory(category)}>
                  <DynamicIcon name="trash" color={category.colorCode} className="h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <AlertDialogComponent isDialogOpen={deleteCategoryDialogOpen} alertType="DELETE_CATEGORY" onSecondaryButtonClick={cancelDeleteCategory} onPrimaryButtonClick={deleteCurrentCategory} />
      </div>
    )
  }
}
