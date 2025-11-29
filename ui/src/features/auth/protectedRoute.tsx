import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
import { Spinner } from '@/components/ui/spinner'
import { selectAuthToken } from '@/slices/authSlice'

export function ProtectedRoute() {
  const token = useSelector(selectAuthToken)
  const location = useLocation()

  if (token === undefined) {
    return <Spinner />
  }

  if (!token) {
    return <Navigate to="/signup" state={{ from: location }} replace />
  }

  return <Outlet />
}
