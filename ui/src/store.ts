import { configureStore } from '@reduxjs/toolkit'
import { accountApi } from './services/accountsApi'
import { authApi } from './services/authApi'
import { categoriesApi } from './services/categoriesApi'
import { expensesApi } from './services/expensesApi'
import { profileApi } from './services/profilesApi'
import authReducer from './slices/authSlice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    [expensesApi.reducerPath]: expensesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(expensesApi.middleware)
      .concat(authApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(accountApi.middleware)
      .concat(profileApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
