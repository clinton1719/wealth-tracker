import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@/components/ui/spinner'
import { useApiError } from '@/hooks/use-api-error'
import { useGetAllExpensesInRangeQuery, useGetExpensesByCategoryAndCreatedAtQuery, useGetExpensesByTagAndCreatedAtQuery, useGetMonthlyExpensesByCategoryQuery, useGetMonthlyExpensesByTagQuery } from '@/services/expensesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import { formatDate } from '@/utilities/helper'
import { ExpenseCategoryLineChart } from './expense-statistics-components/expenseCategoryLineChart'
import { ExpenseCategoryPie } from './expense-statistics-components/expenseCategoryPie'
import { ExpenseCategoryTable } from './expense-statistics-components/expenseCategoryTable'
import { ExpenseLineChart } from './expense-statistics-components/expenseLineChart'
import { ExpensePeriodSelector } from './expense-statistics-components/expensePeriodSelector'
import { ExpenseTagLineChart } from './expense-statistics-components/dxpenseTagLineChart'
import { ExpenseTagPie } from './expense-statistics-components/expenseTagPie'
import { TagCategoryTable } from './expense-statistics-components/expenseTagTable'

export function ExpenseStatistics() {
  const [period, setPeriod] = useState<{ from: Date, to: Date } | null>(null)
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)

  const {
    data: categoryExpenseData,
    isLoading: isCategoryExpenseLoading,
    isFetching: isCategoryExpenseFetching,
    error: categoryExpenseError,
  } = useGetExpensesByCategoryAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const {
    data: tagExpenseData,
    isLoading: isTagExpenseLoading,
    isFetching: isTagExpenseFetching,
    error: tagExpenseError,
  } = useGetExpensesByTagAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const {
    data: monthlyCategoryExpenseData,
    isLoading: isMonthlyCategoryExpenseLoading,
    isFetching: isMonthlyCategoryExpenseFetching,
    error: monthlyCategoryExpenseError,
  } = useGetMonthlyExpensesByCategoryQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const {
    data: monthlyTagExpenseData,
    isLoading: isMonthlyTagExpenseLoading,
    isFetching: isMonthlyTagExpenseFetching,
    error: monthlyTagExpenseError,
  } = useGetMonthlyExpensesByTagQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const {
    data: expensesData,
    isLoading: getAllExpensesLoading,
    isFetching: getAllExpensesFetching,
    error: expensesError,
  } = useGetAllExpensesInRangeQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )

  const { isError: isCategoryExpenseError, errorComponent: categoryExpenseErrorComponent } = useApiError(categoryExpenseError)
  const { isError: isTagExpenseError, errorComponent: tagExpenseErrorComponent } = useApiError(tagExpenseError)
  const { isError: isMonthlyCategoryExpenseError, errorComponent: monthlyCategoryExpenseErrorComponent } = useApiError(monthlyCategoryExpenseError)
  const { isError: isMonthlyTagExpenseError, errorComponent: monthlyTagExpenseErrorComponent } = useApiError(monthlyTagExpenseError)
  const { isError: isGetAllExpensesError, errorComponent: getAllExpensesErrorComponent } = useApiError(expensesError)

  const memoisedCategoryExpenseData = useMemo(() => {
    if (!categoryExpenseData)
      return []
    const enabledCategoryExpenseData = categoryExpenseData.filter(categoryExpense => enabledMap[categoryExpense.profileId])
    return enabledCategoryExpenseData
  }, [categoryExpenseData, enabledMap])

  const memoisedTagExpenseData = useMemo(() => {
    if (!tagExpenseData)
      return []
    const enabledTagExpenseData = tagExpenseData.filter(tagExpense => enabledMap[tagExpense.profileId])
    return enabledTagExpenseData
  }, [tagExpenseData, enabledMap])

  const memoisedMonthlyCategoryExpenseData = useMemo(() => {
    if (!monthlyCategoryExpenseData)
      return []
    const enabledMonthlyCategoryExpenseData = monthlyCategoryExpenseData.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledMonthlyCategoryExpenseData
  }, [monthlyCategoryExpenseData, enabledMap])

  const memoisedMonthlyTagExpenseData = useMemo(() => {
    if (!monthlyTagExpenseData)
      return []
    const enabledMonthlyTagExpenseData = monthlyTagExpenseData.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledMonthlyTagExpenseData
  }, [monthlyTagExpenseData, enabledMap])

  const memoisedExpenseData = useMemo(() => {
    if (!expensesData)
      return []
    const enabledExpenseData = expensesData.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledExpenseData
  }, [expensesData, enabledMap])

  const totalCategoryExpense = memoisedCategoryExpenseData.reduce((acc, currentCategoryExpense) => acc + currentCategoryExpense.expenseAmount, 0)
  const totalTagExpense = memoisedTagExpenseData.reduce((acc, currentTagExpense) => acc + currentTagExpense.expenseAmount, 0)

  if (isCategoryExpenseLoading || isCategoryExpenseFetching || isTagExpenseLoading || isTagExpenseFetching || isMonthlyCategoryExpenseLoading || isMonthlyCategoryExpenseFetching || isMonthlyTagExpenseLoading || isMonthlyTagExpenseFetching || getAllExpensesLoading || getAllExpensesFetching)
    return <Spinner className="spinner" />

  if (isCategoryExpenseError)
    return categoryExpenseErrorComponent
  if (isTagExpenseError)
    return tagExpenseErrorComponent
  if (isMonthlyCategoryExpenseError)
    return monthlyCategoryExpenseErrorComponent
  if (isMonthlyTagExpenseError)
    return monthlyTagExpenseErrorComponent
  if (isGetAllExpensesError)
    return getAllExpensesErrorComponent

  const handleGenerate = (from: Date, to: Date) => setPeriod({ from, to })

  return (
    <div className="container mx-auto px-4 py-6 space-y-12 mb-16">
      <ExpensePeriodSelector onGenerate={handleGenerate} />

      {period && (
        <div className="text-muted-foreground">
          PDF generated for expenses from
          {' '}
          <span className="font-medium">{period.from.toDateString()}</span>
          {' '}
          to
          {' '}
          <span className="font-medium">{period.to.toDateString()}</span>
        </div>
      )}

      {memoisedCategoryExpenseData && memoisedCategoryExpenseData.length > 0 && period && totalCategoryExpense
        ? (
            <ExpenseCategoryTable
              categoryExpenses={memoisedCategoryExpenseData}
              totalExpense={totalCategoryExpense}
              fromDate={period.from.toDateString()}
              toDate={period.to.toDateString()}
            />
          )
        : null}

      {memoisedTagExpenseData && memoisedTagExpenseData.length && period && totalTagExpense
        ? (
            <TagCategoryTable
              tagExpenses={memoisedTagExpenseData}
              totalExpense={totalTagExpense}
              fromDate={period.from.toDateString()}
              toDate={period.to.toDateString()}
            />
          )
        : null}

      <div className="flex flex-col justify-between gap-4">
        {memoisedCategoryExpenseData && memoisedCategoryExpenseData.length > 0 && period
          ? (
              <ExpenseCategoryPie
                categoryExpenses={memoisedCategoryExpenseData}
                fromDate={period.from.toDateString()}
                toDate={period.to.toDateString()}
              />
            )
          : null}

        {memoisedTagExpenseData && memoisedTagExpenseData.length > 0 && period
          ? (
              <ExpenseTagPie
                tagExpenses={memoisedTagExpenseData}
                fromDate={period.from.toDateString()}
                toDate={period.to.toDateString()}
              />
            )
          : null}
      </div>

      {memoisedMonthlyCategoryExpenseData && memoisedMonthlyCategoryExpenseData.length > 0 && period
        ? (
            <ExpenseCategoryLineChart
              monthlyCategoryExpenses={memoisedMonthlyCategoryExpenseData}
              fromDate={period.from.toDateString()}
              toDate={period.to.toDateString()}
            />
          )
        : null}

      {memoisedMonthlyTagExpenseData && memoisedMonthlyTagExpenseData.length > 0 && period
        ? (
            <ExpenseTagLineChart
              monthlyTagExpenses={memoisedMonthlyTagExpenseData}
              fromDate={period.from.toDateString()}
              toDate={period.to.toDateString()}
            />
          )
        : null}

      {memoisedExpenseData && memoisedExpenseData.length > 0 && period
        ? (
            <ExpenseLineChart
              expenses={memoisedExpenseData}
              fromDate={period.from.toDateString()}
              toDate={period.to.toDateString()}
            />
          )
        : null}
    </div>
  )
}
