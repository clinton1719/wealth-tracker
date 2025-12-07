import type { Category } from "@/types/Category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAuthToken } from "@/slices/authSlice";
import { baseAPI } from "@/static-values/constants";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
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
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => `/categories/all`,
      providesTags: ["Categories"],
    }),
    saveCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: "/categories/save",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<Category, Partial<Category>>({
      query: (existingCategory) => ({
        url: `/categories/update`,
        method: "PUT",
        body: existingCategory,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/categories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useSaveCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
