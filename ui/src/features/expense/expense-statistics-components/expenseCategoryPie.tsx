import { Pie, PieChart } from "recharts"

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
import type { ExpenseCategoryPieProps } from "@/types/ExpenseCategoryPieProps"
import { useMemo } from "react"

export function ExpenseCategoryPie({ fromDate, toDate, categoryExpenses }: ExpenseCategoryPieProps) {
    const chartData = useMemo(() => {
        return categoryExpenses.map((item) => ({
            category: item.categoryName.toLowerCase(),
            expenseAmount: item.expenseAmount,
            fill: item.categoryColorCode,
        }));
    }, [categoryExpenses]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {
            expenseAmount: {
                label: "Expense Amount",
            },
        };

        categoryExpenses.forEach((item) => {
            const key = item.categoryName.toLowerCase();
            config[key] = {
                label: item.categoryName,
                color: item.categoryColorCode,
            };
        });

        return config;
    }, [categoryExpenses]) satisfies ChartConfig;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Category</CardTitle>
                <CardDescription>{fromDate} - {toDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-[400px]"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="expenseAmount" label nameKey="category" outerRadius="70%"/>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total categories: {categoryExpenses.length}
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing expense breakdown for the selected period.
                </div>
            </CardFooter>
        </Card>
    )
}
