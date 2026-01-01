import { Spinner } from '@/components/ui/spinner'
import { useExpenseStatistics } from '@/hooks/useExpenseStatistics'
import { base64ToPngBlob, formatDate } from '@/utilities/helper'
import { toPng } from 'html-to-image'
import type { RefObject } from 'react'
import { ExpenseCategoryLineChart } from './expense-statistics-components/expenseCategoryLineChart'
import { ExpenseCategoryPie } from './expense-statistics-components/expenseCategoryPie'
import { ExpenseCategoryTable } from './expense-statistics-components/expenseCategoryTable'
import { ExpenseLineChart } from './expense-statistics-components/expenseLineChart'
import { ExpensePeriodSelector } from './expense-statistics-components/expensePeriodSelector'
import { ExpenseReportGenerator } from './expense-statistics-components/expenseReportGenerator'
import { ExpenseTagLineChart } from './expense-statistics-components/expenseTagLineChart'
import { ExpenseTagPie } from './expense-statistics-components/expenseTagPie'
import { TagCategoryTable } from './expense-statistics-components/expenseTagTable'

interface CaptureTarget {
  name: string
  ref: RefObject<HTMLDivElement | null>
}

export function ExpenseStatistics() {
  const { categoryTableRef,
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
  } = useExpenseStatistics();

  if (isLoading)
    return <Spinner className="spinner" />

  if (isError)
    return errorComponent

  const handleGenerate = (from: Date, to: Date) => setPeriod({ from, to })

  const captureTargets: CaptureTarget[] = [
    { name: 'categoryTable', ref: categoryTableRef },
    { name: 'tagTable', ref: tagTableRef },
    { name: 'categoryPie', ref: categoryPieRef },
    { name: 'tagPie', ref: tagPieRef },
    { name: 'categoryLine', ref: categoryLineChartRef },
    { name: 'tagLine', ref: tagLineChartRef },
    { name: 'expenseLine', ref: expenseLineChartRef },
  ]

  async function captureToPngBlob(
    element: HTMLElement,
  ): Promise<Blob> {
    const base64 = await toPng(element, {
      pixelRatio: 2,
    })

    return base64ToPngBlob(base64)
  }

  const generatePDF = async () => {
    if (!period)
      return

    const missing = captureTargets.filter(
      t => !t.ref?.current,
    )

    if (missing.length > 0) {
      console.error(
        'Missing chart refs:',
        missing.map(m => m.name),
      )
      return
    }

    try {
      const images = await Promise.all(
        captureTargets.map(async ({ name, ref }) => ({
          name,
          blob: await captureToPngBlob(ref.current!),
        })),
      )

      const formData = new FormData()
      formData.append('startDate', formatDate(period.from))
      formData.append('endDate', formatDate(period.to))

      images.forEach(({ name, blob }) => {
        formData.append(
          'chartImages',
          blob,
          `${name}`,
        )
      })

      const pdfBlob = await getExpensesReport(formData).unwrap()

      if (!(pdfBlob instanceof Blob)) {
        throw new TypeError('Invalid PDF response')
      }

      const url = URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'expense-report.pdf'
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

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

      <div ref={tagTableRef}>
        {memoisedTagExpenseData && memoisedTagExpenseData.length && period && totalCategoryExpense
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
      <div ref={categoryPieRef}>
        {memoisedCategoryExpenseData && memoisedCategoryExpenseData.length > 0 && period
          ? (
              <ExpenseCategoryPie
                categoryExpenses={memoisedCategoryExpenseData}
                fromDate={period.from.toDateString()}
                toDate={period.to.toDateString()}
              />
            )
          : null}
      </div>
      <div ref={tagPieRef}>
        {' '}
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
      <div ref={categoryLineChartRef}>
        {memoisedMonthlyCategoryExpenseData && memoisedMonthlyCategoryExpenseData.length > 0 && period
          ? (
              <ExpenseCategoryLineChart
                monthlyCategoryExpenses={memoisedMonthlyCategoryExpenseData}
                fromDate={period.from.toDateString()}
                toDate={period.to.toDateString()}
              />
            )
          : null}
      </div>
      <div ref={tagLineChartRef}>
        {' '}
        {memoisedMonthlyTagExpenseData && memoisedMonthlyTagExpenseData.length > 0 && period
          ? (
              <ExpenseTagLineChart
                monthlyTagExpenses={memoisedMonthlyTagExpenseData}
                fromDate={period.from.toDateString()}
                toDate={period.to.toDateString()}
              />
            )
          : null}
      </div>
      <div ref={expenseLineChartRef}>
        {' '}
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
    </div>
  )
}
