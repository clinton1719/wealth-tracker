import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import { expensesApi } from './services/expensesApi';
import authReducer from './slices/authSlice';
import { categoriesApi } from './services/categoriesApi';
import { accountApi } from './services/accountsApi';
import { profileApi } from './services/profilesApi';

export const store = configureStore({
  reducer: {
    [expensesApi.reducerPath]: expensesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    auth: authReducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expensesApi.middleware).concat(authApi.middleware).concat(categoriesApi.middleware).concat(accountApi.middleware).concat(profileApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
