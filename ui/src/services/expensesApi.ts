import { selectAuthToken } from '@/slices/authSlice';
import { baseAPI } from '@/static-values/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI, prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState() as any);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } else {
        console.log("No token found in state");
      }
      return headers;
    },
  }),
  tagTypes: ['Expenses'],
  endpoints: (builder) => ({
    getExpense: builder.query<Expense, number>({
      query: (id: number) => `/expenses/${id}`,
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
      query: (id: number) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
    }),
  }),
});

export const {
  useGetExpenseQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
