import { baseAPI } from '@/static-values/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Auth {
  accessToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<Auth, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
} = authApi;
