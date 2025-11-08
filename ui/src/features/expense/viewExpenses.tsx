import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewExpenses() {
    return (
        <div className="container mx-auto p-4 min-h-screen mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                        Expense Tracker
                    </h1>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Manage and track your daily expenses
                    </h4>
                </div>
                <Button>Add Expense</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card className="mt-4 w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="font-bold">Total Expenses</CardTitle>
                        <CardDescription>
                            Summary of your expenses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7 not-first:mt-6 font-bold">
                            ₹6,300
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-muted-foreground text-sm">3 transactions</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}