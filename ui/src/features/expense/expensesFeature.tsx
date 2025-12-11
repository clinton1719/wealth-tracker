import type * as z from "zod";
import type { FilteredExpense } from "@/types/FilteredExpense";
import type { UpdateExpense } from "@/types/UpdateExpense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import { AddExpenseForm } from "@/components/building-blocks/forms/addExpenseForm";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { useGetAllAccountsQuery } from "@/services/accountsApi";
import { useGetAllCategoriesQuery } from "@/services/categoriesApi";
import {
  useDeleteExpenseMutation,
  useGetAllExpensesInRangeQuery,
  useSaveExpenseMutation,
  useUpdateExpenseMutation,
} from "@/services/expensesApi";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import { selectProfileSlice } from "@/slices/profileSlice";
import { defaultExpense } from "@/utilities/constants";
import { expenseShouldBePositive } from "@/utilities/errorMessages";
import { formatDate } from "@/utilities/helper";
import { expenseFormSchema } from "@/utilities/zodSchemas";
import { ExpensesList } from "./expense-feature-components/expensesList";
import { ExpenseSummaryCards } from "./expense-feature-components/expenseSummaryCards";

export default function ExpensesFeature() {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteExpenseDialogOpen, setDeleteExpenseDialogOpen] =
    useState<boolean>(false);
  const [currentExpense, setCurrentExpense] = useState<
    Partial<FilteredExpense> | undefined
  >();

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    mode: "onSubmit",
    defaultValues: defaultExpense,
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startDate = formatDate(startOfMonth);
  const endDate = formatDate(endOfMonth);
  const {
    data: expensesData,
    isLoading: getAllExpensesLoading,
    error: expensesError,
  } = useGetAllExpensesInRangeQuery({
    startDate,
    endDate,
    pageNumber: 0,
    pageSize: 100,
  });
  const [saveExpense, { isLoading: saveExpenseLoading }] =
    useSaveExpenseMutation();
  const [updateExpense, { isLoading: updateExpenseLoading }] =
    useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: deleteExpenseLoading }] =
    useDeleteExpenseMutation();
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);
  const {
    error: profilesError,
    isLoading: getAllProfilesLoading,
    data: profilesData,
  } = useGetAllProfilesForUserQuery();
  const {
    error: accountsError,
    isLoading: getAllAccountsLoading,
    data: accountsData,
  } = useGetAllAccountsQuery();
  const {
    error: categoriesError,
    isLoading: getAllCategoriesLoading,
    data: categoriesData,
  } = useGetAllCategoriesQuery();

  const handleUpdateProfile = useCallback(
    (updateExpense: UpdateExpense) => {
      form.reset(updateExpense);
      setExpenseDialogOpen(true);
      setIsUpdate(true);
    },
    [form],
  );

  const { isError: isExpensesError, errorComponent: expensesErrorComponent } =
    useApiError(expensesError);
  const { isError: isProfilesError, errorComponent: profilesErrorComponent } =
    useApiError(profilesError);
  const { isError: isAccountsError, errorComponent: accountsErrorComponent } =
    useApiError(accountsError);
  const {
    isError: isCategoriesError,
    errorComponent: categoriesErrorComponent,
  } = useApiError(categoriesError);

  if (
    getAllExpensesLoading ||
    getAllProfilesLoading ||
    getAllAccountsLoading ||
    getAllCategoriesLoading ||
    saveExpenseLoading ||
    updateExpenseLoading ||
    deleteExpenseLoading
  )
    return <Spinner className="spinner" />;

  if (isExpensesError) {
    return expensesErrorComponent;
  } else if (isProfilesError) {
    return profilesErrorComponent;
  } else if (isAccountsError) {
    return accountsErrorComponent;
  } else if (isCategoriesError) {
    return categoriesErrorComponent;
  }

  const cancelDeleteExpense = () => {
    setDeleteExpenseDialogOpen(false);
  };

  const deleteCurrentExpense = async () => {
    if (currentExpense && currentExpense.expenseId) {
      await deleteExpense(currentExpense.expenseId);
      toast.info(
        `Expense of ${currentExpense.expenseAmount} created at ${currentExpense.expenseCreatedAt} deleted successfully!`,
      );
      setDeleteExpenseDialogOpen(false);
    } else {
      toast.error("Invalid expense! Please refresh the page");
    }
  };

  const handleDeleteAccount = (expense: Partial<FilteredExpense>) => {
    setDeleteExpenseDialogOpen(true);
    setCurrentExpense(expense);
  };

  async function onSubmit(formData: z.infer<typeof expenseFormSchema>) {
    if (isUpdate) {
      await updateExistingExpense(formData);
    } else if (!isUpdate) {
      await saveNewExpense(formData);
    } else {
      toast.error("Unknown action, try again");
    }
  }

  async function saveNewExpense(formData: z.infer<typeof expenseFormSchema>) {
    try {
      const profile = profilesData?.find(
        (profile) => profile.profileName === formData.profileName,
      );

      const category = categoriesData?.find(
        (category) => category.categoryName === formData.categoryName,
      );

      const account = accountsData?.find(
        (account) => account.accountName === formData.accountName,
      );

      if (!category || !profile || !account) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }

      const result = await saveExpense({
        ...formData,
        profileId: profile.profileId,
        accountId: account.accountId,
        categoryId: category.categoryId,
      }).unwrap();

      toast("Expense saved!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Expense of {result.expenseAmount} created at{" "}
              {result.expenseCreatedAt}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setExpenseDialogOpen(false);
    } catch (error: any) {
      if (error?.status === 406) {
        toast.error(`Insufficient balance in account: ${formData.accountName}`);
      } else if (error.status === 400) {
        toast.error("Invalid input. Please check your details.");
      } else if (error.status === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else if (error.status === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else {
        toast.error("Failed to create expense, please try again");
      }
    }
  }

  async function updateExistingExpense(
    formData: z.infer<typeof expenseFormSchema>,
  ) {
    try {
      const category = categoriesData?.find(
        (category) => category.categoryName === formData.categoryName,
      );

      if (!category) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }

      const result = await updateExpense({
        ...formData,
        categoryId: category.categoryId,
      }).unwrap();

      toast("Expense updated!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Expense of {result.expenseAmount} updated at{" "}
              {result.expenseUpdatedAt}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setIsUpdate(false);
      setExpenseDialogOpen(false);
    } catch (error: any) {
      if (error?.status === 406) {
        toast.error(`Insufficient balance in account: ${formData.accountName}`);
      } else if (error.status === 400) {
        if (expenseShouldBePositive === error.data.error) {
          toast.error("Expense should be greater than zero");
        } else {
          toast.error("Invalid input. Please check your details.");
        }
      } else if (error.status === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else if (error.status === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else {
        toast.error("Failed to update expense, please try again");
      }
    }
  }

  if (expensesData && profilesData && accountsData && categoriesData) {
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
          <AddExpenseForm
            expenseDialogOpen={expenseDialogOpen}
            setExpenseDialogOpen={setExpenseDialogOpen}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            form={form}
            onSubmit={onSubmit}
            profiles={profilesData}
            accounts={accountsData}
            categories={categoriesData}
          />
        </div>
        <ExpenseSummaryCards expensesData={expensesData} />
        <ExpensesList
          expensesData={expensesData}
          categoriesData={categoriesData}
          accountsData={accountsData}
          profilesData={profilesData}
          handleUpdateProfile={handleUpdateProfile}
          enabledMap={enabledMap}
          handleDeleteAccount={handleDeleteAccount}
        />
        <AlertDialogComponent
          isDialogOpen={deleteExpenseDialogOpen}
          alertType="DELETE_EXPENSE"
          onSecondaryButtonClick={cancelDeleteExpense}
          onPrimaryButtonClick={deleteCurrentExpense}
        />
      </div>
    );
  }

  return null;
}
