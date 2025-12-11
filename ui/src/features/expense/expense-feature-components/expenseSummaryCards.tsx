import type { ExpenseSummaryCardsProps } from '@/types/ExpenseSummaryCardsProps'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function ExpenseSummaryCards({ expensesData }: ExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-6">
      <Card className="mt-4 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold">Total Expenses</CardTitle>
          <CardDescription>
            Summary of your expenses for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 not-first:mt-6 font-bold">
            ₹
            {expensesData.reduce((total, expense) => total + expense.expenseAmount, 0)}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {expensesData.length}
            {' '}
            transactions this month
          </p>
        </CardFooter>
      </Card>
      <Card className="mt-4 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold">Total Expenses</CardTitle>
          <CardDescription>
            Summary of your expenses for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 not-first:mt-6 font-bold">
            ₹
            {expensesData.reduce((total, expense) => total + expense.expenseAmount, 0)}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {expensesData.length}
            {' '}
            transactions this month
          </p>
        </CardFooter>
      </Card>
      <Card className="mt-4 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold">Total Expenses</CardTitle>
          <CardDescription>
            Summary of your expenses for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 not-first:mt-6 font-bold">
            ₹
            {expensesData.reduce((total, expense) => total + expense.expenseAmount, 0)}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {expensesData.length}
            {' '}
            transactions this month
          </p>
        </CardFooter>
      </Card>
      <Card className="mt-4 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold">Total Expenses</CardTitle>
          <CardDescription>
            Summary of your expenses for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 not-first:mt-6 font-bold">
            ₹
            {expensesData.reduce((total, expense) => total + expense.expenseAmount, 0)}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {expensesData.length}
            {' '}
            transactions this month
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
