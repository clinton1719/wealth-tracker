import type { Expense } from '@/types/Expense'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectAuthToken } from '@/slices/authSlice'
import { baseAPI } from '@/static-values/constants'

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
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
  tagTypes: ['Expenses'],
  endpoints: builder => ({
    saveExpense: builder.mutation<Expense, Partial<Expense>>({
      query: newExpense => ({
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
    getAllExpensesInRange: builder.query<Expense[], { startDate: string, endDate: string, pageNumber: number, pageSize: number }>({
      query: ({ startDate, endDate, pageNumber, pageSize }) => `/expenses/range/${pageNumber}/${pageSize}?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Expenses'],
    }),
  }),
})

export const {
  useSaveExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllExpensesInRangeQuery,
} = expensesApi
