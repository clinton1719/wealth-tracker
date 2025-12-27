import { useApiError } from '@/hooks/use-api-error'
import { useGetAllAccountsQuery } from '@/services/accountsApi'
import { useGetAllCategoriesQuery } from '@/services/categoriesApi'
import {
    useDeleteExpenseMutation,
    useGetAllExpensesInRangeQuery,
    useSaveExpenseMutation,
    useUpdateExpenseMutation,
} from '@/services/expensesApi'
import { useGetAllProfilesForUserQuery } from '@/services/profilesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import type { FilteredExpense } from '@/types/FilteredExpense'
import type { UpdateExpense } from '@/types/UpdateExpense'
import { defaultExpense } from '@/utilities/constants'
import { getMonthRange } from '@/utilities/helper'
import { expenseFormSchema } from '@/utilities/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import type * as z from 'zod'

export function useExpensesFeature() {
    const [expenseDialogOpen, setExpenseDialogOpen] = useState<boolean>(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [deleteExpenseDialogOpen, setDeleteExpenseDialogOpen]
    = useState<boolean>(false)
  const [currentExpense, setCurrentExpense] = useState<
    Partial<FilteredExpense> | undefined
  >()
  const [monthOffset, setMonthOffset] = useState(0)

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    mode: 'onSubmit',
    defaultValues: defaultExpense,
  })

  const { startDate, endDate } = useMemo(
    () => getMonthRange(monthOffset),
    [monthOffset],
  )

  const expensesQuery = useGetAllExpensesInRangeQuery({
    startDate,
    endDate,
  })
  const [saveExpense, saveExpenseState]
    = useSaveExpenseMutation()
  const [updateExpense, updateExpenseState]
    = useUpdateExpenseMutation()
  const [deleteExpense, deleteExpenseState]
    = useDeleteExpenseMutation()
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)
  const profilesQuery = useGetAllProfilesForUserQuery()
  const accountsQuery = useGetAllAccountsQuery()
  const categoriesQuery = useGetAllCategoriesQuery()

  const handleUpdateExpense = useCallback(
    (updateExpense: UpdateExpense) => {
      form.reset({
        ...updateExpense,
        expenseDescription: updateExpense.expenseDescription ?? '',
      })
      setExpenseDialogOpen(true)
      setIsUpdate(true)
    },
    [form],
  )

  const { isError: isExpensesError, errorComponent: expensesErrorComponent }
    = useApiError(expensesQuery.error)
  const { isError: isProfilesError, errorComponent: profilesErrorComponent }
    = useApiError(profilesQuery.error)
  const { isError: isAccountsError, errorComponent: accountsErrorComponent }
    = useApiError(accountsQuery.error)
  const {
    isError: isCategoriesError,
    errorComponent: categoriesErrorComponent,
  } = useApiError(categoriesQuery.error)

  const isError = useMemo(
    () =>
      isExpensesError ||
        isProfilesError ||
        isAccountsError ||
        isCategoriesError,
    [
      isExpensesError,
      isProfilesError,
      isAccountsError,
      isCategoriesError,
    ],
  )
    const errorComponent = useMemo(() => {  
        if (isExpensesError) return expensesErrorComponent
        if (isProfilesError) return profilesErrorComponent
        if (isAccountsError) return accountsErrorComponent
        if (isCategoriesError) return categoriesErrorComponent
        return null
    }, [isExpensesError, isProfilesError, isAccountsError, isCategoriesError])
  
  const isLoading = expensesQuery.isLoading
    || expensesQuery.isFetching
    || saveExpenseState.isLoading
    || updateExpenseState.isLoading
    || deleteExpenseState.isLoading
    || profilesQuery.isLoading
    || profilesQuery.isFetching
    || accountsQuery.isLoading
    || accountsQuery.isFetching
    || categoriesQuery.isLoading
    || categoriesQuery.isFetching;

    const expenses = useMemo(() => expensesQuery.data?.filter((expense) => {
        return (
            enabledMap[expense.profileId]
        )
    }), [expensesQuery.data, enabledMap]);
    const profiles = useMemo(() => profilesQuery.data, [profilesQuery.data]);
    const accounts = useMemo(() => accountsQuery.data, [accountsQuery.data]);
    const categories = useMemo(() => categoriesQuery.data, [categoriesQuery.data]);

    return {    
        expenseDialogOpen,
        setExpenseDialogOpen,
        isUpdate,
        setIsUpdate,
        deleteExpenseDialogOpen,
        setDeleteExpenseDialogOpen,
        currentExpense,
        setCurrentExpense,
        monthOffset,
        setMonthOffset,
        form,
        expenses,
        profiles,
        categories,
        accounts,
        saveExpense,
        updateExpense,
        deleteExpense,
        handleUpdateExpense,
        isError,
        errorComponent,
        isLoading,
        startDate
    }
}