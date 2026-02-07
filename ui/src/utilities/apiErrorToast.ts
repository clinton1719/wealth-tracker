import { toast } from 'sonner'

export function showApiErrorToast(
  error: any,
  fallbackMessage: string,
) {
  switch (error.status) {
    case 400:
      toast.error('Invalid input. Please check your details.')
      break
    case 403:
      toast.error('Access denied.')
      break
    case 404:
      toast.error('Resource not found. Refresh and try again.')
      break
    case 409:
      toast.error(error?.data?.message ?? 'Conflict detected.')
      break
    case 406:
      toast.error('Insufficient balance in account')
      break
    default:
      toast.error(fallbackMessage)
  }
}
