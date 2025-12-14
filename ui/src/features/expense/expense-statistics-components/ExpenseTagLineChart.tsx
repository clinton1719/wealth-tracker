import type { ChartConfig } from '@/components/ui/chart'

import type { ExpenseTagLineChartProps } from '@/types/ExpenseTagLineChartProps'
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

export function ExpenseTagLineChart({ monthlyTagExpenses, fromDate, toDate }: ExpenseTagLineChartProps) {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}

    const uniqueTags = Array.from(new Set(monthlyTagExpenses.map(item => item.tag)))

    uniqueTags.forEach((tag, index) => {
      config[tag] = {
        label: tag,
        color: `var(--chart-${(index % 50) + 1})`,
      }
    })

    return config
  }, [monthlyTagExpenses]) satisfies ChartConfig

  const chartData = useMemo(() => {
    const grouped: Record<string, any> = {}
    const allTags = Array.from(new Set(monthlyTagExpenses.map(item => item.tag)))

    monthlyTagExpenses.forEach((monthlyTagExpense) => {
      const monthKey = monthlyTagExpense.month
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: formatMonth(monthKey),
          _rawMonth: monthKey,
        }
        allTags.forEach((tag) => {
          grouped[monthKey][tag] = 0
        })
      }
      grouped[monthKey][monthlyTagExpense.tag] = monthlyTagExpense.expenseAmount
    })

    return Object.values(grouped).sort((a, b) => a._rawMonth.localeCompare(b._rawMonth))
  }, [monthlyTagExpenses])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses per tag over time</CardTitle>
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
            syncId="expenseTagLineChart"
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
                connectNulls={true}
              />
            ))}

          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total tags:
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
