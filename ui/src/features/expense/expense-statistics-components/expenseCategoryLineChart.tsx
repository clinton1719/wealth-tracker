import type { ChartConfig } from '@/components/ui/chart'

import type { ExpenseCategoryLineChartProps } from '@/types/ExpenseCategoryLineChartProps'
import { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'
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
import { formatMonth } from '@/utilities/helper'

export function ExpenseCategoryLineChart({ monthlyCategoryExpenses, fromDate, toDate }: ExpenseCategoryLineChartProps) {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}

    monthlyCategoryExpenses.forEach((monthlyCategoryExpense) => {
      if (!config[monthlyCategoryExpense.categoryName]) {
        config[monthlyCategoryExpense.categoryName] = {
          label: monthlyCategoryExpense.categoryName,
          color: monthlyCategoryExpense.categoryColorCode,
        }
      }
    })

    return config
  }, [monthlyCategoryExpenses]) satisfies ChartConfig

  const chartData = useMemo(() => {
    const grouped: Record<string, any> = {}

    const allCategories = Array.from(
      new Set(monthlyCategoryExpenses.map(item => item.categoryName)),
    )

    monthlyCategoryExpenses.forEach((item) => {
      const monthKey = item.month

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: formatMonth(monthKey),
          _rawMonth: monthKey,
        }

        allCategories.forEach((cat) => {
          grouped[monthKey][cat] = 0
        })
      }

      grouped[monthKey][item.categoryName] = item.expenseAmount
    })

    return Object.values(grouped).sort((a, b) =>
      a._rawMonth.localeCompare(b._rawMonth),
    )
  }, [monthlyCategoryExpenses])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses per category over time</CardTitle>
        <CardDescription>
          {fromDate}
          {' '}
          -
          {' '}
          {toDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            syncId="expenseCategoryLineChart"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              tickCount={5}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Legend />
            {Object.entries(chartConfig).map(([key, cfg]) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={cfg.color}
                strokeWidth={2}
                dot={true}
              />
            ))}

          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total categories:
          {' '}
          {Object.keys(chartConfig).length}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing expense breakdown for the selected period.
        </div>
      </CardFooter>
    </Card>
  )
}
