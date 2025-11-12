import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import { expensesApi } from './services/expensesApi';
import authReducer from './slices/authSlice';
import { categoriesApi } from './services/categoriesApi';

export const store = configureStore({
  reducer: {
    [expensesApi.reducerPath]: expensesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    auth: authReducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expensesApi.middleware).concat(authApi.middleware).concat(categoriesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
