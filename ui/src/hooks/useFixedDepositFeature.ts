import { useApiError } from '@/hooks/use-api-error'
import { useGetAllAccountsQuery } from '@/services/accountsApi'
import { useDeleteFixedDepositMutation, useGetAllFixedDepositsQuery } from '@/services/fixedDepositsApi'
import { useGetAllProfilesForUserQuery } from '@/services/profilesApi'
import { selectProfileSlice } from '@/slices/profileSlice'
import type { FixedDeposit } from '@/types/FixedDeposit'
import { defaultFixedDeposit } from '@/utilities/constants'
import { fixedDepositFormSchema } from '@/utilities/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import type * as z from 'zod'

export function useFixedDepositFeature() {
    const [fixedDepositDialogOpen, setFixedDepositDialogOpen] = useState<boolean>(false)
    const [fixedDepositSearchText, setFixedDepositSearchText] = useState('')
    const [deleteFixedDepositDialogOpen, setDeleteFixedDepositDialogOpen]
        = useState<boolean>(false)
    const [currentFixedDeposit, setCurrentFixedDeposit] = useState<FixedDeposit | undefined>()

    const form = useForm<z.infer<typeof fixedDepositFormSchema>>({
        resolver: zodResolver(fixedDepositFormSchema),
        mode: 'onSubmit',
        defaultValues: defaultFixedDeposit,
    })

    const getAllProfilesQuery = useGetAllProfilesForUserQuery()
    const getAllFixedDespositsQuery = useGetAllFixedDepositsQuery()
    const [deleteFixedDeposit, { isLoading: deleteFixedDepositLoading }]
        = useDeleteFixedDepositMutation()
    const getAllAccountsQuery = useGetAllAccountsQuery()
    const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice)

    const { isError: isAccountsError, errorComponent: accountsErrorComponent }
        = useApiError(getAllAccountsQuery.error)
    const { isError: isFixedDepositsError, errorComponent: fixedDepositsErrorComponent }
        = useApiError(getAllFixedDespositsQuery.error)
    const { isError: isProfilesError, errorComponent: profilesErrorComponent }
        = useApiError(getAllProfilesQuery.error)

    const isError = isAccountsError
        || isFixedDepositsError
        || isProfilesError;

    const isLoading =
        getAllProfilesQuery.isLoading
        || getAllProfilesQuery.isFetching
        || getAllFixedDespositsQuery.isLoading
        || getAllFixedDespositsQuery.isFetching
        || getAllAccountsQuery.isLoading
        || getAllAccountsQuery.isFetching
        || deleteFixedDepositLoading

    const errorComponent = useMemo(() => {
        if (isAccountsError) return accountsErrorComponent
        if (isFixedDepositsError) return fixedDepositsErrorComponent
        if (isProfilesError) return profilesErrorComponent
        return null
    }, [isAccountsError, isFixedDepositsError, isProfilesError]);

    const filteredFixedDepositsData = useMemo(() => getAllFixedDespositsQuery.data?.filter((fixedDeposit) => {
        return (
            enabledMap[fixedDeposit.profileId]
            && (!fixedDepositSearchText
                || fixedDeposit.fixedDepositName
                    .toLowerCase()
                    .includes(fixedDepositSearchText.toLowerCase()))
        )
    }), [getAllFixedDespositsQuery.data, enabledMap, fixedDepositSearchText])

    const profiles = getAllProfilesQuery.data;
    const accounts = getAllAccountsQuery.data;

    return {
        fixedDepositDialogOpen,
        setFixedDepositDialogOpen,
        setFixedDepositSearchText,
        deleteFixedDepositDialogOpen,
        setDeleteFixedDepositDialogOpen,
        currentFixedDeposit,
        setCurrentFixedDeposit,
        form,
        filteredFixedDepositsData,
        isError,
        isLoading,
        errorComponent,
        deleteFixedDeposit,
        profiles,
        accounts,
    };
}