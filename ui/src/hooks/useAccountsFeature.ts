import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useApiError } from '@/hooks/use-api-error'
import type * as z from 'zod'
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
import type { Account } from '@/types/Account'

export function useAccountsFeature() {
    const [isUpdate, setIsUpdate] = useState(false)
    const [accountDialogOpen, setAccountDialogOpen] = useState<boolean>(false)
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen]
        = useState<boolean>(false)
    const [currentAccount, setCurrentAccount] = useState<Account | undefined>()
    const [accountSearchText, setAccountSearchText] = useState('')

    const form = useForm<z.infer<typeof accountFormSchema>>({
        resolver: zodResolver(accountFormSchema),
        mode: 'onSubmit',
        defaultValues: defaultAccount,
    })

    const accountsQuery = useGetAllAccountsQuery()
    const profilesQuery = useGetAllProfilesForUserQuery()
    const [saveAccount, saveAccountState]
        = useSaveAccountMutation()
    const [updateAccount, updateAccountState]
        = useUpdateAccountMutation()
    const [deleteAccount, deleteAccountState]
        = useDeleteAccountMutation()
    const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)

    const { isError: isAccountsError, errorComponent: accountsErrorComponent }
        = useApiError(accountsQuery.error)
    const { isError: isProfilesError, errorComponent: profilesErrorComponent }
        = useApiError(profilesQuery.error)

    const isError = isAccountsError || isProfilesError;
    const errorComponent = accountsErrorComponent ?? profilesErrorComponent;

    const isLoading = accountsQuery.isLoading
        || accountsQuery.isFetching
        || saveAccountState.isLoading
        || updateAccountState.isLoading
        || deleteAccountState.isLoading
        || profilesQuery.isLoading
        || profilesQuery.isFetching;

    const accounts = useMemo(() => accountsQuery.data?.filter((account) => {
        return (
            enabledMap[account.profileId]
            && (!accountSearchText
                || account.accountName
                    .toLowerCase()
                    .includes(accountSearchText.toLowerCase()))
        )
    }), [accountsQuery.data, enabledMap, accountSearchText])
    const profiles = useMemo(() => profilesQuery.data, [profilesQuery.data])

    return {
        isUpdate,
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
        isLoading,
    }
}