import type { Account } from './Account'
import type { Profile } from './Profile'

export interface AccountSectionProps {
  account: Account
  profile: Profile
  handleDeleteAccount: (account: Account) => void
  handleUpdateAccount: (account: Account, profile: Profile) => void
}
