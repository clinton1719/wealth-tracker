import type { Category } from '@/types/Category'
import type { Expense } from '@/types/Expense'
import type { ExpenseSummaryCardsProps } from '@/types/ExpenseSummaryCardsProps'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useCallback, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/utilities/helper'

export function ExpenseSummaryCards({
  expensesData,
  categoriesData,
}: ExpenseSummaryCardsProps) {
  const getHighestSpendingCategory = useCallback((
    expensesData: Expense[],
    categoriesData: Category[],
  ): { category: Category, totalSpent: number } | null => {
    if (!expensesData || expensesData.length === 0) {
      return null
    }

    const totalsByCategory = expensesData.reduce(
      (acc, exp) => {
        acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.expenseAmount
        return acc
      },
      {} as Record<number, number>,
    )

    let maxCategoryId: number | null = null
    let maxAmount = -Infinity

    for (const [categoryId, total] of Object.entries(totalsByCategory)) {
      if (total > maxAmount) {
        maxAmount = total
        maxCategoryId = Number(categoryId)
      }
    }

    const foundCategory = categoriesData.find(cat => cat.categoryId === maxCategoryId)

    if (!maxCategoryId || !foundCategory) {
      return null
    }

    return {
      category: foundCategory,
      totalSpent: maxAmount,
    }
  }, [])

  const getHighestSpendingTag = useCallback((
    expensesData: Expense[],
    categoriesData: Category[],
  ): { tag: string, totalSpent: number } | null => {
    if (!expensesData || expensesData.length === 0)
      return null

    const totalsByTag = expensesData.reduce(
      (acc, expense) => {
        const tags: string[] | undefined = categoriesData.find(
          category => category.categoryId === expense.categoryId,
        )?.categoryTags
        if (tags) {
          for (const tag of tags) {
            acc[tag] = (acc[tag] || 0) + expense.expenseAmount
          }
        }
        return acc
      },
      {} as Record<string, number>,
    )

    let maxTag = null
    let maxTagAmount = -Infinity

    for (const [tag, total] of Object.entries(totalsByTag)) {
      if (total > maxTagAmount) {
        maxTagAmount = total
        maxTag = tag
      }
    }

    if (!maxTag)
      return null

    return {
      tag: maxTag,
      totalSpent: maxTagAmount,
    }
  }, [])

  const monthlyExpense = useMemo(
    () =>
      expensesData.reduce((total, expense) => total + expense.expenseAmount, 0),
    [expensesData],
  )

  const monthlyTransactions = useMemo(
    () => expensesData.length,
    [expensesData],
  )

  const highestSpendingCategory = useMemo(
    () => getHighestSpendingCategory(expensesData, categoriesData),
    [expensesData, categoriesData, getHighestSpendingCategory],
  )

  const highestSpendingTag = useMemo(
    () => getHighestSpendingTag(expensesData, categoriesData),
    [expensesData, categoriesData, getHighestSpendingTag],
  )

  return (
    <div className="flex flex-col md:flex-row justify-between mt-6">
      <Card className="card card-border border-black">
        <CardHeader>
          <CardTitle className="font-bold">Total expenses</CardTitle>
          <CardDescription>
            Summary of your expenses for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 not-first:mt-6 font-bold">
            {formatCurrency(monthlyExpense)}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {monthlyTransactions}
            {' '}
            transactions this month
          </p>
        </CardFooter>
      </Card>
      <Card className="card card-border border-black">
        <CardHeader>
          <CardTitle className="font-bold">Top category</CardTitle>
          <CardDescription>
            Highest spending category this month
          </CardDescription>
        </CardHeader>
        {highestSpendingCategory
          ? (
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span>Category:</span>
                    <span className="highlightBox flex gap-2">
                      <DynamicIcon
                        name={
                          highestSpendingCategory.category.categoryIcon
                            ? highestSpendingCategory.category.categoryIcon
                            : ('badge-check' as any)
                        }
                        color={highestSpendingCategory.category.categoryColorCode}
                      />
                      {highestSpendingCategory.category.categoryName}
                    </span>
                  </div>
                </div>
              </CardContent>
            )
          : (
              <></>
            )}
        {highestSpendingCategory && highestSpendingCategory.totalSpent
          ? (
              <CardFooter>
                <p className="text-muted-foreground text-sm">
                  {formatCurrency(highestSpendingCategory.totalSpent)}
                  {' '}
                  spent this
                  month
                </p>
              </CardFooter>
            )
          : (
              <></>
            )}
      </Card>
      <Card className="card card-border border-black">
        <CardHeader>
          <CardTitle className="font-bold">Top tag</CardTitle>
          <CardDescription>Highest spending tag this month</CardDescription>
        </CardHeader>
        {highestSpendingTag
          ? (
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span>Tag:</span>
                    <span className="highlightBox flex gap-2">
                      {highestSpendingTag.tag}
                    </span>
                  </div>
                </div>
              </CardContent>
            )
          : (
              <></>
            )}
        {highestSpendingTag && highestSpendingTag.totalSpent
          ? (
              <CardFooter>
                <p className="text-muted-foreground text-sm">
                  {formatCurrency(highestSpendingTag?.totalSpent)}
                  {' '}
                  spent this month
                </p>
              </CardFooter>
            )
          : (
              <></>
            )}
      </Card>
    </div>
  )
}
