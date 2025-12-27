import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddExpenseForm } from '@/components/building-blocks/forms/addExpenseForm'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useExpensesFeature } from '@/hooks/useExpensesFeature'
import type { FilteredExpense } from '@/types/FilteredExpense'
import { showApiErrorToast } from '@/utilities/apiErrorToast'
import { formatCurrency, resolveAccountId, resolveCategoryId, resolveProfileId } from '@/utilities/helper'
import { expenseFormSchema } from '@/utilities/zodSchemas'
import { toast } from 'sonner'
import type * as z from 'zod'
import { ExpensesList } from './expense-feature-components/expensesList'
import { ExpenseSummaryCards } from './expense-feature-components/expenseSummaryCards'

export default function ExpensesFeature() {
  const {
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
    accounts,
    categories,
    saveExpense,
    updateExpense,
    deleteExpense,
    handleUpdateExpense,
    isError,
    errorComponent,
    isLoading,
    startDate
  } = useExpensesFeature();

  if (
    isLoading
  ) {
    return <Spinner className="spinner" />
  }

  if (isError) {
    return errorComponent
  }

  const cancelDeleteExpense = () => {
    setDeleteExpenseDialogOpen(false)
  }

  const deleteCurrentExpense = async () => {
    if (currentExpense && currentExpense.expenseId) {
      await deleteExpense(currentExpense.expenseId).unwrap()
      toast.info(
        `Expense of ${currentExpense.expenseAmount} created at ${currentExpense.expenseCreatedAt} deleted successfully!`,
      )
      setDeleteExpenseDialogOpen(false)
    }
    else {
      toast.error('Invalid expense! Please refresh the page')
    }
  }

  const handleDeleteExpense = (expense: Partial<FilteredExpense>) => {
    setDeleteExpenseDialogOpen(true)
    setCurrentExpense(expense)
  }

  async function onSubmit(formData: z.infer<typeof expenseFormSchema>) {
    if (isUpdate) {
      await updateExistingExpense(formData)
    }
    else if (!isUpdate) {
      await saveNewExpense(formData)
    }
    else {
      toast.error('Unknown action, try again')
    }
  }

  async function saveNewExpense(formData: z.infer<typeof expenseFormSchema>) {
    try {
      if (profiles && accounts && categories) {
        const profileId = resolveProfileId(profiles, formData.profileName);
        const accountId = resolveAccountId(accounts, formData.profileName);
        const categoryId = resolveCategoryId(categories, formData.profileName);

        const result = await saveExpense({
          ...formData,
          profileId,
          accountId,
          categoryId,
        }).unwrap()

        toast.success(`Expense ${formatCurrency(result.expenseAmount)} saved!`)

        setExpenseDialogOpen(false)
      } else {
        toast.error('Invalid data found, refresh and try again')
        return
      }
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to create account')
      }
    }
  }

  async function updateExistingExpense(
    formData: z.infer<typeof expenseFormSchema>,
  ) {
    try {
      if (categories) {
        const categoryId = resolveCategoryId(categories, formData.profileName);
        const result = await updateExpense({
          ...formData,
          categoryId,
        }).unwrap()

        toast.success(`Expense ${formatCurrency(result.expenseAmount)} updated!`)

        setIsUpdate(false)
        setExpenseDialogOpen(false)
      } else {
        toast.error('Invalid data found, refresh and try again')
        return
      }
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to create account')
      }
    }
  }

  if (expenses && profiles && accounts && categories) {
    return (
      <div className="container mx-auto p-4 min-h-screen mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading1">
              Expense Tracker
            </h1>
            <h4 className="heading4">
              Manage and track your daily expenses
            </h4>
          </div>
          <AddExpenseForm
            expenseDialogOpen={expenseDialogOpen}
            setExpenseDialogOpen={setExpenseDialogOpen}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            form={form}
            onSubmit={onSubmit}
            profiles={profiles}
            accounts={accounts}
            categories={categories}
          />
        </div>
        <ExpenseSummaryCards
          expensesData={expenses}
          categoriesData={categories}
        />
        <div className="flex items-center justify-between mb-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setMonthOffset(prev => prev - 1)}
          >
            Previous Month
          </Button>

          <h2 className="font-bold text-xl">
            {new Date(startDate).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <Button
            variant="outline"
            disabled={monthOffset === 0}
            onClick={() => {
              if (monthOffset !== 0) {
                setMonthOffset(prev => prev + 1)
              }
            }}
          >
            Next Month
          </Button>
        </div>
        <ExpensesList
          expensesData={expenses}
          categoriesData={categories}
          accountsData={accounts}
          profilesData={profiles}
          handleUpdateExpense={handleUpdateExpense}
          handleDeleteExpense={handleDeleteExpense}
        />
        <AlertDialogComponent
          isDialogOpen={deleteExpenseDialogOpen}
          alertType="DELETE_EXPENSE"
          onSecondaryButtonClick={cancelDeleteExpense}
          onPrimaryButtonClick={deleteCurrentExpense}
        />
      </div>
    )
  }

  return null
}
