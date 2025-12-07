import type * as z from 'zod'
import type { Account } from '@/types/Account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { AccountSection } from '@/components/building-blocks/accountSection'
import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddAccountForm } from '@/components/building-blocks/forms/addAccountForm'
import { Spinner } from '@/components/ui/spinner'
import { TabsContent } from '@/components/ui/tabs'
import { useApiError } from '@/hooks/use-api-error'
import {
  useDeleteAccountMutation,
  useGetAllAccountsQuery,
  useSaveAccountMutation,
  useUpdateAccountMutation,
} from '@/services/accountsApi'
import { useGetAllProfilesForUserQuery } from '@/services/profilesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import { defaultAccount } from '@/utilities/constants'
import { accountFormSchema } from '@/utilities/zodSchemas'

export function AccountsSection() {
  const [isUpdate, setIsUpdate] = useState(false)
  const [accountDialogOpen, setAccountDialogOpen] = useState<boolean>(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen]
    = useState<boolean>(false)
  const [currentAccount, setCurrentAccount] = useState<Account | undefined>()

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    mode: 'onSubmit',
    defaultValues: defaultAccount,
  })

  const {
    error: accountsError,
    isLoading: getAllAccountsLoading,
    data: accountsData,
  } = useGetAllAccountsQuery()
  const {
    error: profilesError,
    isLoading: getAllProfilesLoading,
    data: profilesData,
  } = useGetAllProfilesForUserQuery()
  const [saveAccount, { isLoading: saveAccountLoading }]
    = useSaveAccountMutation()
  const [updateAccount, { isLoading: updateAccountLoading }]
    = useUpdateAccountMutation()
  const [deleteAccount, { isLoading: deleteAccountLoading }]
    = useDeleteAccountMutation()
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)
  const { isError: isAccountsError, errorComponent: accountsErrorComponent } = useApiError(accountsError)
  const { isError: isProfilesError, errorComponent: profilesErrorComponent } = useApiError(profilesError)

  if (
    getAllAccountsLoading
    || saveAccountLoading
    || updateAccountLoading
    || deleteAccountLoading
    || getAllProfilesLoading
  ) {
    return <Spinner />
  }

  if (isAccountsError) {
    return accountsErrorComponent
  }
  if (isProfilesError) {
    return profilesErrorComponent
  }

  const filteredData = accountsData?.filter(
    account => enabledMap[account.profileId],
  )

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
      const profile = profilesData?.find(profile => profile.profileName === formData.profileName)
      if (!profile) {
        toast.error('Invalid data found, refresh and try again')
        return
      }
      const result = await saveAccount({ ...formData, profileId: profile.id }).unwrap()

      toast('Account saved!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Account name:
              {result.accountName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setAccountDialogOpen(false)
    }
    catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Account already exists with name: ${formData.accountName}`,
        )
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else if (error.originalStatus === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else {
        toast.error('Failed to create account, please try again')
      }
    }
  }

  async function updateExistingAccount(
    formData: z.infer<typeof accountFormSchema>,
  ) {
    try {
      const updatedFormData = {
        ...formData,
        accountPicture: undefined,
      }
      const profile = profilesData?.find(profile => profile.profileName === updatedFormData.profileName)
      if (!profile) {
        toast.error('Invalid data found, refresh and try again')
        return
      }
      const result = await updateAccount({ ...updatedFormData, profileId: profile.id }).unwrap()

      if (!result) {
        toast.error('Failed to update account, please try again later')
        return
      }

      toast('Account updated!', {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: 'var(--background-code, #1a1a1a)',
              color: 'var(--foreground-code, #f5f5f5)',
            }}
          >
            <code>
              Account name:
              {' '}
              {result.accountName}
            </code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
          'background': 'var(--background, #fff)',
          'color': 'var(--foreground, #000)',
        } as React.CSSProperties,
      })

      setIsUpdate(false)
      setAccountDialogOpen(false)
    }
    catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Account already exists with name: ${formData.accountName}`,
        )
      }
      else if (error.originalStatus === 400) {
        toast.error('Invalid input. Please check your details.')
      }
      else if (error.originalStatus === 403) {
        toast.error(
          'Access denied. You do not have permission to access this resource.',
        )
      }
      else if (error.originalStatus === 404) {
        toast.error('This resource does not exist, kindly refresh your page.')
      }
      else {
        toast.error('Failed to update account, please try again')
      }
    }
  }

  const cancelDeleteAccount = () => {
    setDeleteAccountDialogOpen(false)
  }

  const deleteCurrentAccount = async () => {
    if (currentAccount && currentAccount.id) {
      await deleteAccount(currentAccount.id)
      toast.info(
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

  if (profilesData) {
    return (
      <TabsContent value="accounts">
        <div className="space-y-4 mt-2">
          {filteredData
            ? (
              filteredData.map((account) => {
                const profile = profilesData.find(profile => profile.id === account.profileId)
                if (profile) {
                  return (
                    <AccountSection
                      account={account}
                      profile={profile}
                      key={account.id}
                      form={form}
                      setIsUpdate={setIsUpdate}
                      setAccountDialogOpen={setAccountDialogOpen}
                      handleDeleteAccount={handleDeleteAccount}
                    />
                  )
                } else {
                  return <p role="alert" className="text-red-600 font-medium">
                    Profile not found for this account, contact admin.
                  </p>

                }
              })
            )
            : (
              <p className="text-muted-foreground text-sm">
                Create a new account here
              </p>
            )}
          {profilesData
            ? (
              <AddAccountForm
                profiles={profilesData}
                form={form}
                onSubmit={onSubmit}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
                accountDialogOpen={accountDialogOpen}
                setAccountDialogOpen={setAccountDialogOpen}
              />
            )
            : <p>Something went wrong with enabling creating accounts</p>}

        </div>
        <AlertDialogComponent
          isDialogOpen={deleteAccountDialogOpen}
          alertType="DELETE_ACCOUNT"
          onSecondaryButtonClick={cancelDeleteAccount}
          onPrimaryButtonClick={deleteCurrentAccount}
        />
      </TabsContent>
    )
  }
}
