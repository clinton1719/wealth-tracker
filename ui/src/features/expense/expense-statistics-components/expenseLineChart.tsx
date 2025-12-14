import type { ChartConfig } from '@/components/ui/chart'
import type { ExpenseLineChartProps } from '@/types/ExpenseLineChartProps'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
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

export function ExpenseLineChart({ expenses, fromDate, toDate }: ExpenseLineChartProps) {
  const chartConfig = {
    total: {
      label: 'Total Expenses',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig

  const chartData = useMemo(() => {
    const grouped: Record<string, any> = {}

    expenses.forEach((expense) => {
      const parts = expense.expenseCreatedAt.split('-')
      if (parts.length !== 3)
        return

      const month = parts[1]
      const year = parts[2]
      const monthKey = `${year}-${month}`

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: formatMonth(monthKey),
          _rawMonth: monthKey,
          total: 0,
        }
      }

      grouped[monthKey].total += expense.expenseAmount
    })

    return Object.values(grouped).sort((a, b) =>
      a._rawMonth.localeCompare(b._rawMonth),
    )
  }, [expenses])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Monthly Expenses</CardTitle>
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
            margin={{ left: 12, right: 12 }}
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
              tickFormatter={v => `₹${v.toLocaleString()}`}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Line
              dataKey="total"
              type="monotone"
              stroke={chartConfig.total.color}
              strokeWidth={3}
              dot={{ fill: chartConfig.total.color, r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Consolidated view for
          {' '}
          {Object.keys(chartData).length}
          {' '}
          months.
        </div>
      </CardFooter>
    </Card>
  )
}
