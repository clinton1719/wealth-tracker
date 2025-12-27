import type { Account } from "@/types/Account"
import type { Category } from "@/types/Category"
import type { Profile } from "@/types/Profile"
import { toast } from "sonner"

export const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key === 'Enter')
    e.preventDefault()
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
  return formatted
}

export function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Date(year, month - 1).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function base64ToPngBlob(base64: string): Blob {
  const byteString = atob(base64.split(',')[1])
  const byteArray = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }

  return new Blob([byteArray], { type: 'image/png' })
}

export function resolveProfileId(
  profiles: Profile[],
  profileName: string,
): number {
  const profile = profiles.find(p => p.profileName === profileName)
  if (!profile) {
    toast.error('Invalid data found, refresh and try again');
    throw new Error('Profile not found');
  }
  return profile.profileId;
}

export function resolveAccountId(
  accounts: Account[],
  accountName: string,
): number {
  const account = accounts.find(p => p.accountName === accountName)
  if (!account) {
    toast.error('Invalid data found, refresh and try again');
    throw new Error('Account not found');
  }
  return account.accountId;
}

export function resolveCategoryId(
  categories: Category[],
  categoryName: string,
): number {
  const category = categories.find(p => p.categoryName === categoryName)
  if (!category) {
    toast.error('Invalid data found, refresh and try again');
    throw new Error('Category not found');
  }
  return category.categoryId;
}

export function getMonthRange(offset: number) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, offset === 0 ? now.getDate() : 0)

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  }
}
