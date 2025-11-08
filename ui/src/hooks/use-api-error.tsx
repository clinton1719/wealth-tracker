import ErrorPage from '@/features/error/errorPage';
import LoginPage from '@/features/login/loginPage';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ReactElement } from 'react';

export type ApiError = FetchBaseQueryError | SerializedError;

interface ErrorResponse {
    isError: boolean;
    errorComponent: ReactElement | null;
}

export const useApiError = (error: ApiError | undefined): ErrorResponse => {
    if (!error) {
        return { isError: false, errorComponent: null };
    }

    if ('status' in error) {
        switch (error.status) {
            case 403:
                return {
                    isError: true,
                    errorComponent: <LoginPage />
                };
            case 404:
                return {
                    isError: true,
                    errorComponent: <ErrorPage errorCode={404} />
                };
            default:
                return {
                    isError: true,
                    errorComponent: <ErrorPage errorCode={500} />
                };
        }
    }

    return {
        isError: true,
        errorComponent: <ErrorPage errorCode={500} />
    };
};