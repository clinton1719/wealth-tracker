import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Expenses'],
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => '/expenses',
      providesTags: ['Expenses'],
    }),
    addExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (newExpense) => ({
        url: '/expenses',
        method: 'POST', 
        body: newExpense,
      }),
      invalidatesTags: ['Expenses'],
    }),
    deleteExpense: builder.mutation<void, number>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
