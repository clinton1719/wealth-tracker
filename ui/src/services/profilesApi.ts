import type { Profile } from '@/types/Profile'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectAuthToken } from '@/slices/authSlice'
import { baseAPI } from '@/static-values/constants'

export const profileApi = createApi({
  reducerPath: 'Profile',
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
  tagTypes: ['Profiles'],
  endpoints: builder => ({
    getAllProfilesForUser: builder.query<Profile[], void>({
      query: () => `/profiles/all`,
      providesTags: ['Profiles'],
    }),
    saveProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (newProfile) => {
        const formData = new FormData();
        Object.entries(newProfile).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value as any);
          }
        });

        return {
          url: '/profiles/save',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Profiles'],
    }),
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: existingProfile => ({
        url: `/profiles/update`,
        method: 'PUT',
        body: existingProfile,
      }),
      invalidatesTags: ['Profiles'],
    }),
    deleteProfile: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/profiles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profiles'],
    }),
  }),
})

export const {
  useGetAllProfilesForUserQuery,
  useSaveProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi
