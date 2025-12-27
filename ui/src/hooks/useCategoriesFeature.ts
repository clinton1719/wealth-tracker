import { useApiError } from '@/hooks/use-api-error'
import {
    useDeleteCategoryMutation,
    useGetAllCategoriesQuery,
    useSaveCategoryMutation,
    useUpdateCategoryMutation,
} from '@/services/categoriesApi'
import { useGetAllProfilesForUserQuery } from '@/services/profilesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import type { Category } from '@/types/Category'
import { defaultCategory } from '@/utilities/constants'
import { categoryFormSchema } from '@/utilities/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import type * as z from 'zod'

export function useCategoriesFeature() {
    const [isUpdate, setIsUpdate] = useState(false)
    const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen]
        = useState<boolean>(false)
    const [currentCategory, setCurrentCategory] = useState<
        Category | undefined
    >()
    const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
    const [categorySearchText, setCategorySearchText] = useState('')
    const [selectedTag, setSelectedTag] = useState('')

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        mode: 'onSubmit',
        defaultValues: defaultCategory,
    })

    const [saveCategory, saveCategoryState]
        = useSaveCategoryMutation();
    const [updateCategory, updateCategoryState]
        = useUpdateCategoryMutation();
    const [deleteCategory, deleteCategoryState]
        = useDeleteCategoryMutation();
    const categoriesQuery = useGetAllCategoriesQuery();
    const profilesQuery = useGetAllProfilesForUserQuery();
    const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)
    const {
        isError: isCategoriesError,
        errorComponent: categoriesErrorComponent,
    } = useApiError(categoriesQuery.error)
    const { isError: isProfilesError, errorComponent: profilesErrorComponent }
        = useApiError(profilesQuery.error)

    const isError = isCategoriesError || isProfilesError;
    const errorComponent = categoriesErrorComponent ?? profilesErrorComponent;
    const isLoading = categoriesQuery.isLoading
        || categoriesQuery.isFetching
        || profilesQuery.isLoading
        || profilesQuery.isFetching
        || saveCategoryState.isLoading
        || updateCategoryState.isLoading
        || deleteCategoryState.isLoading;

    const categories = useMemo(() => categoriesQuery.data?.filter((category) => {
        return (
            enabledMap[category.profileId]
            && (!categorySearchText
                || category.categoryName
                    .toLowerCase()
                    .includes(categorySearchText.toLowerCase()))
            && (selectedTag ? category.categoryTags?.includes(selectedTag) : true)
        )
    }), [categoriesQuery.data, enabledMap, categorySearchText, selectedTag])

    const profiles = useMemo(() => profilesQuery.data, [profilesQuery.data])

    const tagsList = useMemo(() => categories?.flatMap(
        category => category.categoryTags,
    ), [categories])
    const tags = [...new Set(tagsList)]

    return {
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
        isLoading,
        profiles,
    };
}