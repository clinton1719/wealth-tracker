import type { Expense } from '@/types/Expense'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectAuthToken } from '@/slices/authSlice'
import { baseAPI } from '@/static-values/constants'
import { ALL_TAG_TYPES } from '@/utilities/constants'
import type { CategoryExpense } from '@/types/CategoryExpense'
import type { TagExpense } from '@/types/TagExpense'

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI,
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState() as any)
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ALL_TAG_TYPES,
  endpoints: builder => ({
    saveExpense: builder.mutation<Expense, Partial<Expense>>({
      query: newExpense => ({
        url: '/expenses/save',
        method: 'POST',
        body: newExpense,
      }),
      invalidatesTags: ['Expenses', 'Accounts'],
    }),
    updateExpense: builder.mutation<Expense, Partial<Expense>>({
      query: existingExpense => ({
        url: `/expenses/update`,
        method: 'PUT',
        body: existingExpense,
      }),
      invalidatesTags: ['Expenses', 'Accounts'],
    }),
    deleteExpense: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/expenses/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses', 'Accounts'],
    }),
    getAllExpensesInRange: builder.query<
      Expense[],
      {
        startDate: string
        endDate: string
      }
    >({
      query: ({ startDate, endDate }) =>
        `/expenses/range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Expenses'],
    }),
    getExpensesByCategoryAndCreatedAt: builder.query<
      CategoryExpense[],
      {
        startDate: string
        endDate: string
      }
    >({
      query: ({ startDate, endDate }) =>
        `/expenses/by-category-and-created-at?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Expenses'],
    }),
    getExpensesByTagAndCreatedAt: builder.query<
      TagExpense[],
      {
        startDate: string
        endDate: string
      }
    >({
      query: ({ startDate, endDate }) =>
        `/expenses/by-tag-and-created-at?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Expenses'],
    }),
  }),
})

export const {
  useSaveExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllExpensesInRangeQuery,
  useGetExpensesByCategoryAndCreatedAtQuery,
  useGetExpensesByTagAndCreatedAtQuery,
  useUpdateExpenseMutation,
} = expensesApi
