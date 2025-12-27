import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddExpenseForm } from '@/components/building-blocks/forms/addExpenseForm'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useExpensesFeature } from '@/hooks/useExpensesFeature'
import type { FilteredExpense } from '@/types/FilteredExpense'
import { expenseShouldBePositive } from '@/utilities/errorMessages'
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
      const profile = profiles?.find(
        profile => profile.profileName === formData.profileName,
      )

      const category = categories?.find(
        category => category.categoryName === formData.categoryName,
      )

      const account = accounts?.find(
        account => account.accountName === formData.accountName,
      )

      if (!category || !profile || !account) {
        toast.error('Invalid data found, refresh and try again')
        return
      }

      const result = await saveExpense({
        ...formData,
        profileId: profile.profileId,
        accountId: account.accountId,
        categoryId: category.categoryId,
      }).unwrap()

      toast('Expense saved!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Expense of
              {' '}
              {result.expenseAmount}
              {' '}
              created at
              {' '}
              {result.expenseCreatedAt}
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

      setExpenseDialogOpen(false)
    }
    catch (error: any) {
      if (error?.status === 406) {
        toast.error(`Insufficient balance in account: ${formData.accountName}`)
      }
      else if (error.status === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.status === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else if (error.status === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else {
        toast.error('Failed to create expense, please try again')
      }
    }
  }

  async function updateExistingExpense(
    formData: z.infer<typeof expenseFormSchema>,
  ) {
    try {
      const category = categories?.find(
        category => category.categoryName === formData.categoryName,
      )

      if (!category) {
        toast.error('Invalid data found, refresh and try again')
        return
      }

      const result = await updateExpense({
        ...formData,
        categoryId: category.categoryId,
      }).unwrap()

      toast('Expense updated!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Expense of
              {' '}
              {result.expenseAmount}
              {' '}
              updated at
              {' '}
              {result.expenseUpdatedAt}
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
      setExpenseDialogOpen(false)
    }
    catch (error: any) {
      if (error?.status === 406) {
        toast.error(`Insufficient balance in account: ${formData.accountName}`)
      }
      else if (error.status === 400) {
        if (expenseShouldBePositive === error.data.error) {
          toast.error('Expense should be greater than zero')
        }
        else {
          toast.error('Invalid input. Please check your details.')
        }
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
        toast.error('Failed to update expense, please try again')
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
