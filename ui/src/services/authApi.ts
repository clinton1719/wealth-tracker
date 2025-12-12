import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseAPI } from '@/static-values/constants'
import { ALL_TAG_TYPES } from '@/utilities/constants'

interface Auth {
  accessToken: string
}

interface LoginData {
  username: string
  password: string
}

interface SignUpData {
  username: string
  password: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI,
  }),
  tagTypes: ALL_TAG_TYPES,
  endpoints: builder => ({
    login: builder.mutation<Auth, LoginData>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: builder.mutation<Auth, SignUpData>({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation, useSignUpMutation } = authApi
