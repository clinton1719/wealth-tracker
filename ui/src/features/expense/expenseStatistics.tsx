import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo, useRef, useState, type RefObject } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@/components/ui/spinner'
import { useApiError } from '@/hooks/use-api-error'
import { useGetAllExpensesInRangeQuery, useGetExpensesByCategoryAndCreatedAtQuery, useGetExpensesByTagAndCreatedAtQuery, useGetExpensesReportMutation, useGetMonthlyExpensesByCategoryQuery, useGetMonthlyExpensesByTagQuery } from '@/services/expensesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import { toPng } from 'html-to-image';
import { base64ToPngBlob, formatDate } from '@/utilities/helper'
import { ExpenseCategoryLineChart } from './expense-statistics-components/expenseCategoryLineChart'
import { ExpenseCategoryPie } from './expense-statistics-components/expenseCategoryPie'
import { ExpenseCategoryTable } from './expense-statistics-components/expenseCategoryTable'
import { ExpenseLineChart } from './expense-statistics-components/expenseLineChart'
import { ExpensePeriodSelector } from './expense-statistics-components/expensePeriodSelector'
import { ExpenseTagLineChart } from './expense-statistics-components/expenseTagLineChart'
import { ExpenseTagPie } from './expense-statistics-components/expenseTagPie'
import { TagCategoryTable } from './expense-statistics-components/expenseTagTable'
import { ExpenseReportGenerator } from './expense-statistics-components/expenseReportGenerator'

type CaptureTarget = {
  name: string;
  ref: RefObject<HTMLDivElement | null>;
};


export function ExpenseStatistics() {
  const categoryTableRef = useRef<HTMLDivElement>(null);
  const tagTableRef = useRef<HTMLDivElement>(null);
  const categoryPieRef = useRef<HTMLDivElement>(null);
  const tagPieRef = useRef<HTMLDivElement>(null);
  const categoryLineChartRef = useRef<HTMLDivElement>(null);
  const tagLineChartRef = useRef<HTMLDivElement>(null);
  const expenseLineChartRef = useRef<HTMLDivElement>(null);
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
  const [
    getExpensesReport, {
      isLoading: getExpensesReportLoading,
      error: expensesReportError,
    }
  ] = useGetExpensesReportMutation()

  const { isError: isCategoryExpenseError, errorComponent: categoryExpenseErrorComponent } = useApiError(categoryExpenseError)
  const { isError: isTagExpenseError, errorComponent: tagExpenseErrorComponent } = useApiError(tagExpenseError)
  const { isError: isMonthlyCategoryExpenseError, errorComponent: monthlyCategoryExpenseErrorComponent } = useApiError(monthlyCategoryExpenseError)
  const { isError: isMonthlyTagExpenseError, errorComponent: monthlyTagExpenseErrorComponent } = useApiError(monthlyTagExpenseError)
  const { isError: isGetAllExpensesError, errorComponent: getAllExpensesErrorComponent } = useApiError(expensesError)
  const { isError: isExpensesReportError, errorComponent: getExpensesReportErrorComponent } = useApiError(expensesReportError)

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

  if (isCategoryExpenseLoading || isCategoryExpenseFetching || isTagExpenseLoading || isTagExpenseFetching || isMonthlyCategoryExpenseLoading || isMonthlyCategoryExpenseFetching || isMonthlyTagExpenseLoading || isMonthlyTagExpenseFetching || getAllExpensesLoading || getAllExpensesFetching || getExpensesReportLoading)
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
  if (isExpensesReportError)
    return getExpensesReportErrorComponent

  const handleGenerate = (from: Date, to: Date) => setPeriod({ from, to });

  const captureTargets: CaptureTarget[] = [
    { name: 'categoryTable', ref: categoryTableRef },
    { name: 'tagTable', ref: tagTableRef },
    { name: 'categoryPie', ref: categoryPieRef },
    { name: 'tagPie', ref: tagPieRef },
    { name: 'categoryLine', ref: categoryLineChartRef },
    { name: 'tagLine', ref: tagLineChartRef },
    { name: 'expenseLine', ref: expenseLineChartRef },
  ];

  async function captureToPngBlob(
    element: HTMLElement
  ): Promise<Blob> {
    const base64 = await toPng(element, {
      pixelRatio: 2,
    });

    return base64ToPngBlob(base64);
  }

  const generatePDF = async () => {
    if (!period) return;

    const missing = captureTargets.filter(
      t => !t.ref?.current
    );

    if (missing.length > 0) {
      console.error(
        'Missing chart refs:',
        missing.map(m => m.name)
      );
      return;
    }

    try {
      const images = await Promise.all(
        captureTargets.map(async ({ name, ref }) => ({
          name,
          blob: await captureToPngBlob(ref.current!),
        }))
      );

      const formData = new FormData();
      formData.append('startDate', formatDate(period.from));
      formData.append('endDate', formatDate(period.to));

      images.forEach(({ name, blob }) => {
        formData.append(
          'chartImages',
          blob,
          `${name}`
        );
      });

      const pdfBlob = await getExpensesReport(formData).unwrap();

      if (!(pdfBlob instanceof Blob)) {
        throw new Error('Invalid PDF response');
      }

      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense-report.pdf';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-12 mb-16">
      <ExpensePeriodSelector onGenerate={handleGenerate} />

      {period && (
        <ExpenseReportGenerator generatePDF={generatePDF} />
      )}

      <div ref={categoryTableRef}>
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
      </div>

      <div ref={tagTableRef}>{memoisedTagExpenseData && memoisedTagExpenseData.length && period && totalCategoryExpense
        ? (
          <TagCategoryTable
            tagExpenses={memoisedTagExpenseData}
            totalExpense={totalCategoryExpense}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
      <div ref={categoryPieRef}>{memoisedCategoryExpenseData && memoisedCategoryExpenseData.length > 0 && period
        ? (
          <ExpenseCategoryPie
            categoryExpenses={memoisedCategoryExpenseData}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
      <div ref={tagPieRef}> {memoisedTagExpenseData && memoisedTagExpenseData.length > 0 && period
        ? (
          <ExpenseTagPie
            tagExpenses={memoisedTagExpenseData}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
      <div ref={categoryLineChartRef}>{memoisedMonthlyCategoryExpenseData && memoisedMonthlyCategoryExpenseData.length > 0 && period
        ? (
          <ExpenseCategoryLineChart
            monthlyCategoryExpenses={memoisedMonthlyCategoryExpenseData}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
      <div ref={tagLineChartRef}>  {memoisedMonthlyTagExpenseData && memoisedMonthlyTagExpenseData.length > 0 && period
        ? (
          <ExpenseTagLineChart
            monthlyTagExpenses={memoisedMonthlyTagExpenseData}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
      <div ref={expenseLineChartRef}> {memoisedExpenseData && memoisedExpenseData.length > 0 && period
        ? (
          <ExpenseLineChart
            expenses={memoisedExpenseData}
            fromDate={period.from.toDateString()}
            toDate={period.to.toDateString()}
          />
        )
        : null}
      </div>
    </div>
  )
}
