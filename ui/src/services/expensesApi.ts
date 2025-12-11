import type { Expense } from "@/types/Expense";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAuthToken } from "@/slices/authSlice";
import { baseAPI } from "@/static-values/constants";
import { ALL_TAG_TYPES } from "@/utilities/constants";

export const expensesApi = createApi({
  reducerPath: "expensesApi",
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI,
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState() as any);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ALL_TAG_TYPES,
  endpoints: (builder) => ({
    saveExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (newExpense) => ({
        url: "/expenses/save",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expenses", "Accounts"],
    }),
    updateExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (existingExpense) => ({
        url: `/expenses/update`,
        method: "PUT",
        body: existingExpense,
      }),
      invalidatesTags: ["Expenses", "Accounts"],
    }),
    deleteExpense: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/expenses/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses", "Accounts"],
    }),
    getAllExpensesInRange: builder.query<
      Expense[],
      {
        startDate: string;
        endDate: string;
        pageNumber: number;
        pageSize: number;
      }
    >({
      query: ({ startDate, endDate, pageNumber, pageSize }) =>
        `/expenses/range/${pageNumber}/${pageSize}?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useSaveExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllExpensesInRangeQuery,
  useUpdateExpenseMutation
} = expensesApi;
