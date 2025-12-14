import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { ExpenseCategoryLineChartProps } from "@/types/ExpenseCategoryLineChartProps"
import { useMemo } from "react"


export function ExpenseCategoryLineChart({ monthlyCategoryExpenses, fromDate, toDate }: ExpenseCategoryLineChartProps) {
    const chartConfig = useMemo(() => {
        const config: ChartConfig = {}

        monthlyCategoryExpenses.forEach(e => {
            if (!config[e.categoryName]) {
                config[e.categoryName] = {
                    label: e.categoryName,
                    color: e.categoryColorCode,
                }
            }
        })

        return config
    }, [monthlyCategoryExpenses]) satisfies ChartConfig

    const formatMonth = (yearMonth: string) => {
        const [year, month] = yearMonth.split('-').map(Number)
        return new Date(year, month - 1).toLocaleString('en-US', {
            month: 'short',
            year: 'numeric',
        })
    }

    const chartData = useMemo(() => {
        const grouped: Record<string, any> = {}

        monthlyCategoryExpenses.forEach(e => {
            if (!grouped[e.month]) {
                grouped[e.month] = {
                    month: formatMonth(e.month),
                    _rawMonth: e.month,
                }
            }

            grouped[e.month][e.categoryName] = e.expenseAmount
        })

        return Object.values(grouped)
    }, [monthlyCategoryExpenses])


    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses over time</CardTitle>
                <CardDescription>{fromDate} - {toDate}</CardDescription>
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
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {Object.entries(chartConfig).map(([key, cfg]) => (
                            <Line
                                key={key}
                                dataKey={key}
                                type="monotone"
                                stroke={cfg.color}
                                strokeWidth={2}
                                dot={false}
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
