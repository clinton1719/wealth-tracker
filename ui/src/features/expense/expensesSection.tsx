import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { useGetAllExpensesInRangeQuery } from "@/services/expensesApi";
import { formatDate } from "@/utilities/helper";

export default function ExpensesSection() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startDate = formatDate(startOfMonth);
  const endDate = formatDate(endOfMonth);
  const { data, isLoading, error } = useGetAllExpensesInRangeQuery({
    startDate,
    endDate,
    pageNumber: 0,
    pageSize: 100,
  });
  const { isError, errorComponent } = useApiError(error);

  if (isLoading) return <Spinner className="spinner"/>;
  if (isError) return errorComponent;

  if (data) {
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
                ₹{data.reduce((total, expense) => total + expense.amount, 0)}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {data.length} transactions this month
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
                ₹{data.reduce((total, expense) => total + expense.amount, 0)}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {data.length} transactions this month
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
                ₹{data.reduce((total, expense) => total + expense.amount, 0)}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {data.length} transactions this month
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
                ₹{data.reduce((total, expense) => total + expense.amount, 0)}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {data.length} transactions this month
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
