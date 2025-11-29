import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ReactElement } from 'react'
import Login from '@/features/auth/login'
import SignUp from '@/features/auth/signUp'
import ErrorPage from '@/features/error/errorPage'

export type ApiError = FetchBaseQueryError | SerializedError

interface ErrorResponse {
  isError: boolean
  errorComponent: ReactElement | null
}

export function useApiError(error: ApiError | undefined): ErrorResponse {
  if (!error) {
    return { isError: false, errorComponent: null }
  }

  if ('status' in error) {
    switch (error.status) {
      case 401:
        return {
          isError: true,
          errorComponent: <Login isTokenExpired={true} />,
        }
      case 403:
        return {
          isError: true,
          errorComponent: <SignUp />,
        }
      case 404:
        return {
          isError: true,
          errorComponent: <ErrorPage errorCode={404} />,
        }
      default:
        console.error('Unhandled API error:', error)
        return {
          isError: true,
          errorComponent: <ErrorPage errorCode={500} />,
        }
    }
  }

  return {
    isError: true,
    errorComponent: <ErrorPage errorCode={500} />,
  }
}
