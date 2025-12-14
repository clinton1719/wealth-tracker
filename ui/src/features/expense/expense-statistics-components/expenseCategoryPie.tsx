import type { ChartConfig } from '@/components/ui/chart'

import type { ExpenseCategoryPieProps } from '@/types/ExpenseCategoryPieProps'
import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,

} from '@/components/ui/chart'

export function ExpenseCategoryPie({ fromDate, toDate, categoryExpenses }: ExpenseCategoryPieProps) {
  const chartData = useMemo(() => {
    return categoryExpenses.map(categoryExpense => ({
      category: categoryExpense.categoryName.toLowerCase(),
      expenseAmount: categoryExpense.expenseAmount,
      fill: categoryExpense.categoryColorCode,
    }))
  }, [categoryExpenses])

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      expenseAmount: {
        label: 'Expense Amount',
      },
    }

    categoryExpenses.forEach((categoryExpense) => {
      const key = categoryExpense.categoryName.toLowerCase()
      config[key] = {
        label: categoryExpense.categoryName,
        color: categoryExpense.categoryColorCode,
      }
    })

    return config
  }, [categoryExpenses]) satisfies ChartConfig

  const borderGradient = useMemo(() => {
    const colors = categoryExpenses.reduce<string[]>(
      (acc, expense) => {
        acc.push(expense.profileColorCode)
        return acc
      },
      [],
    )
    if (colors.length === 0)
      return undefined
    if (colors.length === 1)
      return colors[0]

    const step = 100 / colors.length

    return `linear-gradient(
                90deg,
                ${colors
                  .map(
                    (color, i) =>
                      `${color} ${i * step}%, ${color} ${(i + 1) * step}%`,
                  )
                  .join(',')}
                )`
  }, [categoryExpenses])

  return (
    <Card
      className="flex flex-col rounded-xl"
      style={{
        border: '2px solid transparent',
        backgroundImage: borderGradient
          ? `linear-gradient(var(--background), var(--background)), ${borderGradient}`
          : undefined,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Category</CardTitle>
        <CardDescription>
          {fromDate}
          {' '}
          -
          {' '}
          {toDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="expenseAmount" label nameKey="category" outerRadius="70%" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total categories:
          {' '}
          {categoryExpenses.length}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing expense breakdown for the selected period.
        </div>
      </CardFooter>
    </Card>
  )
}
