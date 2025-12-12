import type { UseFormReturn } from 'react-hook-form'
import type { Account } from './Account'
import type { Profile } from './Profile'

export interface AccountSectionProps {
  account: Account
  profile: Profile
  form: UseFormReturn<
    {
      accountName: string
      accountBalance: number
      accountType: string
      profileName: string
      id?: number | undefined
      accountDescription?: string | undefined
    },
    any,
    {
      accountName: string
      accountBalance: number
      accountType: string
      profileName: string
      id?: number | undefined
      accountDescription?: string | undefined
    }
  >
  setAccountDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteAccount: (account: Account) => void
}
