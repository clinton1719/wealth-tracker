import { selectAuthToken } from '@/slices/authSlice';
import { baseAPI } from '@/static-values/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Auth {
  accessToken: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignUpData {
  username: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<Auth, LoginData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: builder.mutation<Auth, SignUpData>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
} = authApi;
