import { useApiError } from '@/hooks/use-api-error'
import { useGetAllExpensesInRangeQuery, useGetExpensesByCategoryAndCreatedAtQuery, useGetExpensesByTagAndCreatedAtQuery, useGetExpensesReportMutation, useGetMonthlyExpensesByCategoryQuery, useGetMonthlyExpensesByTagQuery } from '@/services/expensesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import { formatDate } from '@/utilities/helper'
import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export function useExpenseStatistics() {
    const categoryTableRef = useRef<HTMLDivElement>(null)
  const tagTableRef = useRef<HTMLDivElement>(null)
  const categoryPieRef = useRef<HTMLDivElement>(null)
  const tagPieRef = useRef<HTMLDivElement>(null)
  const categoryLineChartRef = useRef<HTMLDivElement>(null)
  const tagLineChartRef = useRef<HTMLDivElement>(null)
  const expenseLineChartRef = useRef<HTMLDivElement>(null)
  const [period, setPeriod] = useState<{ from: Date, to: Date } | null>(null)
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)

  const expensesByCategoryAndCreatedAtQuery = useGetExpensesByCategoryAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const expensesByTagAndCreatedAtQuery = useGetExpensesByTagAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const monthlyExpensesByCategoryQuery = useGetMonthlyExpensesByCategoryQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const monthlyExpensesByTagQuery = useGetMonthlyExpensesByTagQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const allExpensesInRangeQuery = useGetAllExpensesInRangeQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken,
  )
  const [
    getExpensesReport,
    {
      isLoading: getExpensesReportLoading,
      error: expensesReportError,
    },
  ] = useGetExpensesReportMutation()

  const { isError: isCategoryExpenseError, errorComponent: categoryExpenseErrorComponent } = useApiError(expensesByCategoryAndCreatedAtQuery.error)
  const { isError: isTagExpenseError, errorComponent: tagExpenseErrorComponent } = useApiError(expensesByTagAndCreatedAtQuery.error)
  const { isError: isMonthlyCategoryExpenseError, errorComponent: monthlyCategoryExpenseErrorComponent } = useApiError(monthlyExpensesByCategoryQuery.error)
  const { isError: isMonthlyTagExpenseError, errorComponent: monthlyTagExpenseErrorComponent } = useApiError(monthlyExpensesByTagQuery.error)
  const { isError: isGetAllExpensesError, errorComponent: getAllExpensesErrorComponent } = useApiError(allExpensesInRangeQuery.error)
  const { isError: isExpensesReportError, errorComponent: getExpensesReportErrorComponent } = useApiError(expensesReportError)

  const isError = isCategoryExpenseError 
  || isTagExpenseError 
  || isMonthlyCategoryExpenseError 
  || isMonthlyTagExpenseError 
  || isGetAllExpensesError 
  || isExpensesReportError; 

  const isLoading = 
  expensesByCategoryAndCreatedAtQuery.isLoading
  || expensesByCategoryAndCreatedAtQuery.isFetching
  || expensesByTagAndCreatedAtQuery.isLoading
  || expensesByTagAndCreatedAtQuery.isFetching
  || monthlyExpensesByCategoryQuery.isLoading
  || monthlyExpensesByCategoryQuery.isFetching
  || monthlyExpensesByTagQuery.isLoading
  || monthlyExpensesByTagQuery.isFetching
  || allExpensesInRangeQuery.isLoading
  || allExpensesInRangeQuery.isFetching
  || getExpensesReportLoading;

  const errorComponent = useMemo(() => {
      if (isCategoryExpenseError) return categoryExpenseErrorComponent
      if (isTagExpenseError) return tagExpenseErrorComponent
      if (isMonthlyCategoryExpenseError) return monthlyCategoryExpenseErrorComponent
      if (isMonthlyTagExpenseError) return monthlyTagExpenseErrorComponent
      if (isGetAllExpensesError) return getAllExpensesErrorComponent
      if (isExpensesReportError) return getExpensesReportErrorComponent
      return null
    }, [isCategoryExpenseError, isTagExpenseError, isMonthlyCategoryExpenseError, isMonthlyTagExpenseError, isGetAllExpensesError, isExpensesReportError]);

  const memoisedCategoryExpenseData = useMemo(() => {
    if (!expensesByCategoryAndCreatedAtQuery.data)
      return []
    const enabledCategoryExpenseData = expensesByCategoryAndCreatedAtQuery.data.filter(categoryExpense => enabledMap[categoryExpense.profileId])
    return enabledCategoryExpenseData;
  }, [expensesByCategoryAndCreatedAtQuery.data, enabledMap])

  const memoisedTagExpenseData = useMemo(() => {
    if (!expensesByTagAndCreatedAtQuery.data)
      return []
    const enabledTagExpenseData = expensesByTagAndCreatedAtQuery.data.filter(tagExpense => enabledMap[tagExpense.profileId])
    return enabledTagExpenseData
  }, [expensesByTagAndCreatedAtQuery.data, enabledMap])

  const memoisedMonthlyCategoryExpenseData = useMemo(() => {
    if (!monthlyExpensesByCategoryQuery.data)
      return []
    const enabledMonthlyCategoryExpenseData = monthlyExpensesByCategoryQuery.data.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledMonthlyCategoryExpenseData
  }, [monthlyExpensesByCategoryQuery.data, enabledMap])

  const memoisedMonthlyTagExpenseData = useMemo(() => {
    if (!monthlyExpensesByTagQuery.data)
      return []
    const enabledMonthlyTagExpenseData = monthlyExpensesByTagQuery.data.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledMonthlyTagExpenseData
  }, [monthlyExpensesByTagQuery.data, enabledMap])

  const memoisedExpenseData = useMemo(() => {
    if (!allExpensesInRangeQuery.data)
      return []
    const enabledExpenseData = allExpensesInRangeQuery.data.filter(monthlyCategoryExpense => enabledMap[monthlyCategoryExpense.profileId])
    return enabledExpenseData
  }, [allExpensesInRangeQuery.data, enabledMap])

  const totalCategoryExpense = useMemo(() => memoisedCategoryExpenseData.reduce((acc, currentCategoryExpense) => acc + currentCategoryExpense.expenseAmount, 0), [memoisedCategoryExpenseData]);

  return {
    categoryTableRef,
    tagTableRef,
    categoryPieRef,
    tagPieRef,
    categoryLineChartRef,
    tagLineChartRef,
    expenseLineChartRef,
    isLoading,
    isError,  
    errorComponent,
    getExpensesReport,  
    period,
    memoisedCategoryExpenseData,
    totalCategoryExpense,
    memoisedTagExpenseData,
    memoisedMonthlyCategoryExpenseData,
    memoisedMonthlyTagExpenseData,
    memoisedExpenseData,
    setPeriod
  };
}