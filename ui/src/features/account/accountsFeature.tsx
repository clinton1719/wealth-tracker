import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddAccountForm } from '@/components/building-blocks/forms/addAccountForm'
import { AccountSection } from '@/components/building-blocks/sections/accountSection'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAccountsFeature } from '@/hooks/useAccountsFeature'
import type { Account } from '@/types/Account'
import type { Profile } from '@/types/Profile'
import { showApiErrorToast } from '@/utilities/apiErrorToast'
import { resolveProfileId } from '@/utilities/helper'
import { accountFormSchema } from '@/utilities/zodSchemas'
import { Fragment } from 'react'
import { toast } from 'sonner'
import type * as z from 'zod'

export function AccountsFeature() {
  const { isUpdate,
    setIsUpdate,
    accountDialogOpen,
    setAccountDialogOpen,
    deleteAccountDialogOpen,
    setDeleteAccountDialogOpen,
    currentAccount,
    setCurrentAccount,
    setAccountSearchText,
    form,
    accounts,
    profiles,
    saveAccount,
    updateAccount,
    deleteAccount,
    isError,
    errorComponent,
    isLoading, } = useAccountsFeature();

  if (
    isLoading
  ) {
    return <Spinner className="spinner" />
  }

  if (isError) {
    return errorComponent
  }

  async function onSubmit(formData: z.infer<typeof accountFormSchema>) {
    if (isUpdate) {
      await updateExistingAccount(formData)
    }
    else if (!isUpdate) {
      await saveNewAccount(formData)
    }
    else {
      toast.error('Unknown action, try again')
    }
  }

  async function saveNewAccount(formData: z.infer<typeof accountFormSchema>) {
    try {
      if (profiles) {
        const profileId = resolveProfileId(profiles, formData.profileName);
        const result = await saveAccount({
          ...formData,
          profileId,
        }).unwrap()

        toast.success(`Account ${result.accountName} saved!`)

        setAccountDialogOpen(false)
      } else {
        toast.error('Invalid data found, refresh and try again')
        return
      }
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to create account')
      }
    }
  }

  async function updateExistingAccount(
    formData: z.infer<typeof accountFormSchema>,
  ) {
    try {
      if (profiles) {
        const profileId = resolveProfileId(profiles, formData.profileName);
        const updatedFormData = {
          ...formData,
          accountPicture: undefined,
        }

        const result = await updateAccount({
          ...updatedFormData,
          profileId,
        }).unwrap()

        toast.success(`Account ${result.accountName} updated!`)

        setIsUpdate(false)
        setAccountDialogOpen(false)
      } else {
        toast.error('Invalid data found, refresh and try again')
        return
      }
    }
    catch (error: any) {
      if (error.status) {
        showApiErrorToast(error, 'Failed to update account')
      }
    }
  }

  const deleteCurrentAccount = async () => {
    if (currentAccount && currentAccount.accountId) {
      await deleteAccount(currentAccount.accountId).unwrap()
      toast.success(
        `Account : ${currentAccount.accountName} deleted successfully!`,
      )
      setDeleteAccountDialogOpen(false)
    }
    else {
      toast.error('Invalid account! Please refresh the page')
    }
  }

  const handleDeleteAccount = (account: Account) => {
    setDeleteAccountDialogOpen(true)
    setCurrentAccount(account)
  }

  const handleUpdateAccount = (account: Account, profile: Profile) => {
    form.reset({
      ...account,
      accountDescription: account.accountDescription ?? '',
    })
    form.setValue('profileName', profile.profileName)
    setAccountDialogOpen(true)
    setIsUpdate(true)
  }

  if (profiles && accounts) {
    return (
      <div id="accountsSection">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Accounts</h1>
          <Input
            type="search"
            placeholder="Search accounts by name..."
            className="search-bar"
            onChange={e => setAccountSearchText(e.target.value)}
          />
          <AddAccountForm
            profiles={profiles}
            form={form}
            onSubmit={onSubmit}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            accountDialogOpen={accountDialogOpen}
            setAccountDialogOpen={setAccountDialogOpen}
          />
        </div>
        <div className="normal-grid">
          {accounts
            .map((account) => {
              const profile = profiles.find(
                profile => profile.profileId === account.profileId,
              )
              if (profile) {
                return (
                  <AccountSection
                    account={account}
                    profile={profile}
                    key={account.accountId}
                    handleUpdateAccount={handleUpdateAccount}
                    handleDeleteAccount={handleDeleteAccount}
                  />
                )
              }
              else {
                return (
                  <Fragment key={account.accountId}>
                  </Fragment>
                )
              }
            })}
        </div>
        <AlertDialogComponent
          isDialogOpen={deleteAccountDialogOpen}
          alertType="DELETE_ACCOUNT"
          onSecondaryButtonClick={() => setDeleteAccountDialogOpen(false)}
          onPrimaryButtonClick={deleteCurrentAccount}
        />
      </div>
    )
  }
}
