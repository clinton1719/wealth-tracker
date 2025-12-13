import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { useGetExpensesByCategoryAndCreatedAtQuery } from "@/services/expensesApi";
import { formatDate } from "@/utilities/helper";
import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import { ExpenseCategoryTable } from "./expense-statistics-components/expenseCategoryTable";
import { ExpensePeriodSelector } from "./expense-statistics-components/expensePeriodSelector";

export function ExpenseStatistics() {
  const [period, setPeriod] = useState<{ from: Date; to: Date } | null>(null);

  const {
    data: categoryExpenseData,
    isLoading,
    isFetching,
    error,
  } = useGetExpensesByCategoryAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken
  );

  const { isError, errorComponent } = useApiError(error);

  const memoisedCategoryExpenseData = useMemo(() => {
    if (!categoryExpenseData) return [];
    return categoryExpenseData;
  }, [categoryExpenseData]);

  const totalExpense = memoisedCategoryExpenseData.reduce((acc, currentCategoryExpense) => acc + currentCategoryExpense.expenseAmount, 0);

  if (isLoading || isFetching) return <Spinner className="spinner" />;
  if (isError) return errorComponent;

  const handleGenerate = (from: Date, to: Date) => setPeriod({ from, to });

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      <ExpensePeriodSelector onGenerate={handleGenerate} />

      {period && (
        <div className="text-muted-foreground">
          PDF generated for expenses from{" "}
          <span className="font-medium">{period.from.toDateString()}</span> to{" "}
          <span className="font-medium">{period.to.toDateString()}</span>
        </div>
      )}

      {categoryExpenseData && period ? (
        <ExpenseCategoryTable
          categoryExpenses={memoisedCategoryExpenseData}
          totalExpense={totalExpense}
          fromDate={period.from.toDateString()}
          toDate={period.to.toDateString()}
        />
      ) : null}
    </div>
  );
}