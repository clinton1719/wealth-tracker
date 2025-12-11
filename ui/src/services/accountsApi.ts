import type { Account } from "@/types/Account";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAuthToken } from "@/slices/authSlice";
import { baseAPI } from "@/static-values/constants";
import { ALL_TAG_TYPES } from "@/utilities/constants";

export const accountApi = createApi({
  reducerPath: "accountApi",
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
    getAllAccounts: builder.query<Account[], void>({
      query: () => `/accounts/all`,
      providesTags: ["Accounts"],
    }),
    saveAccount: builder.mutation<Account, Partial<Account>>({
      query: (newAccount) => ({
        url: "/accounts/save",
        method: "POST",
        body: newAccount,
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation<Account, Partial<Account>>({
      query: (existingAccount) => ({
        url: `/accounts/update`,
        method: "PUT",
        body: existingAccount,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteAccount: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/accounts/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAllAccountsQuery,
  useSaveAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi;
