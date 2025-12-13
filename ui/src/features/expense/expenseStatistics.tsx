import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { useGetExpensesByCategoryAndCreatedAtQuery, useGetExpensesByTagAndCreatedAtQuery } from "@/services/expensesApi";
import { formatDate } from "@/utilities/helper";
import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import { ExpenseCategoryTable } from "./expense-statistics-components/expenseCategoryTable";
import { ExpensePeriodSelector } from "./expense-statistics-components/expensePeriodSelector";
import { TagCategoryTable } from "./expense-statistics-components/tagCategoryTable";

export function ExpenseStatistics() {
  const [period, setPeriod] = useState<{ from: Date; to: Date } | null>(null);

  const {
    data: categoryExpenseData,
    isLoading: isCategoryExpenseLoading,
    isFetching: isCategoryExpenseFetching,
    error: categoryExpenseError,
  } = useGetExpensesByCategoryAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken
  );
  const {
    data: tagExpenseData,
    isLoading: isTagExpenseLoading,
    isFetching: isTagExpenseFetching,
    error: tagExpenseError,
  } = useGetExpensesByTagAndCreatedAtQuery(
    period ? { startDate: formatDate(period.from), endDate: formatDate(period.to) } : skipToken
  );

  const { isError: isCategoryExpenseError, errorComponent: categoryExpenseErrorComponent } = useApiError(categoryExpenseError);
  const { isError: isTagExpenseError, errorComponent: tagExpenseErrorComponent } = useApiError(tagExpenseError);

  const memoisedCategoryExpenseData = useMemo(() => {
    if (!categoryExpenseData) return [];
    return categoryExpenseData;
  }, [categoryExpenseData]);

  const memoisedTagExpenseData = useMemo(() => {
    if (!tagExpenseData) return [];
    return tagExpenseData;
  }, [tagExpenseData]);

  const totalCategoryExpense = memoisedCategoryExpenseData.reduce((acc, currentCategoryExpense) => acc + currentCategoryExpense.expenseAmount, 0);
  const totalTagExpense = memoisedTagExpenseData.reduce((acc, currentTagExpense) => acc + currentTagExpense.expenseAmount, 0);

  if (isCategoryExpenseLoading || isCategoryExpenseFetching || isTagExpenseLoading || isTagExpenseFetching) return <Spinner className="spinner" />;
  if (isCategoryExpenseError) return categoryExpenseErrorComponent;
  if (isTagExpenseError) return tagExpenseErrorComponent;

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

      {categoryExpenseData && period && totalCategoryExpense ? (
        <ExpenseCategoryTable
          categoryExpenses={memoisedCategoryExpenseData}
          totalExpense={totalCategoryExpense}
          fromDate={period.from.toDateString()}
          toDate={period.to.toDateString()}
        />
      ) : null}

      {tagExpenseData && period && totalTagExpense ? (
        <TagCategoryTable
          tagExpenses={memoisedTagExpenseData}
          totalExpense={totalTagExpense}
          fromDate={period.from.toDateString()}
          toDate={period.to.toDateString()}
        />
      ) : null}
    </div>
  );
}