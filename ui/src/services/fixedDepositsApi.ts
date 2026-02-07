import type { FixedDeposit } from '@/types/FixedDeposit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectAuthToken } from '@/slices/authSlice'
import { baseAPI } from '@/static-values/constants'
import { ALL_TAG_TYPES } from '@/utilities/constants'

export const fixedDepositApi = createApi({
  reducerPath: 'fixedDepositApi',
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
    getAllFixedDeposits: builder.query<FixedDeposit[], void>({
      query: () => '/investments/fixed-deposits/all',
      providesTags: ['FixedDeposits'],
    }),
    saveFixedDeposit: builder.mutation<FixedDeposit, Partial<FixedDeposit>>({
      query: newAccount => ({
        url: '/investments/fixed-deposits/save',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: ['Accounts'],
    }),
    deleteFixedDeposit: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/investments/fixed-deposits/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FixedDeposits'],
    }),
  }),
})

export const {
  useGetAllFixedDepositsQuery,
  useSaveFixedDepositMutation,
  useDeleteFixedDepositMutation,
} = fixedDepositApi
