import type { RootState } from "@/store";
import type { Profile } from "@/types/Profile";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAuthToken } from "@/slices/authSlice";
import { enableProfile } from "@/slices/profileSlice";
import { baseAPI } from "@/static-values/constants";
import { ALL_TAG_TYPES } from "@/utilities/constants";

export const profileApi = createApi({
  reducerPath: "Profile",
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
    getAllProfilesForUser: builder.query<Profile[], void>({
      query: () => `/profiles/all`,
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: profiles } = await queryFulfilled;

          const state = getState() as RootState;
          const existing = state.profile.enabled;

          profiles.forEach((p) => {
            if (!(p.profileId in existing)) {
              dispatch(enableProfile(p.profileId));
            }
          });
        } catch (error) {
          console.error(error);
        }
      },
      providesTags: ["Profiles"],
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
          url: "/profiles/save",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Profiles"],
    }),
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (updatedProfile) => {
        const formData = new FormData();
        Object.entries(updatedProfile).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value as any);
          }
        });

        return {
          url: "/profiles/update",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Profiles"],
    }),
    deleteProfile: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/profiles/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profiles"],
    }),
  }),
});

export const {
  useGetAllProfilesForUserQuery,
  useSaveProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
