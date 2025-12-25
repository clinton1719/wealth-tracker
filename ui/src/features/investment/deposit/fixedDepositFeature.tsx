import { AddFixedDepositForm } from "@/components/building-blocks/forms/addFixedDepositForm";
import { Input } from "@/components/ui/input";
import type * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { fixedDepositFormSchema } from "@/utilities/zodSchemas";
import { defaultFixedDeposit } from "@/utilities/constants";
import { Fragment, useMemo, useState } from "react";
import { useGetAllAccountsQuery } from "@/services/accountsApi";
import { useSelector } from "react-redux";
import { selectProfileSlice } from "@/slices/profileSlice";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import type { FixedDeposit } from "@/types/FixedDeposit";
import { toast } from "sonner";
import { useDeleteFixedDepositMutation, useGetAllFixedDepositsQuery } from "@/services/fixedDepositsApi";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import { FixedDepositSection } from "@/components/building-blocks/sections/fixedDepositSection";

export function FixedDepositFeature() {
    const [fixedDepositDialogOpen, setFixedDepositDialogOpen] = useState<boolean>(false);
    const [fixedDepositSearchText, setFixedDepositSearchText] = useState('');
    const [deleteFixedDepositDialogOpen, setDeleteFixedDepositDialogOpen]
        = useState<boolean>(false);
    const [currentFixedDeposit, setCurrentFixedDeposit] = useState<FixedDeposit | undefined>()

    const form = useForm<z.infer<typeof fixedDepositFormSchema>>({
        resolver: zodResolver(fixedDepositFormSchema),
        mode: 'onSubmit',
        defaultValues: defaultFixedDeposit,
    });

    const {
        error: profilesError,
        isLoading: getAllProfilesLoading,
        isFetching: getAllProfilesFetching,
        data: profilesData,
    } = useGetAllProfilesForUserQuery()
    const {
        error: fixedDepositsError,
        isLoading: getAllFixedDepositsLoading,
        isFetching: getAllFixedDepositsFetching,
        data: fixedDepositsData,
    } = useGetAllFixedDepositsQuery();
    const [deleteFixedDeposit, { isLoading: deleteFixedDepositLoading }]
        = useDeleteFixedDepositMutation()
    const {
        error: accountsError,
        isLoading: getAllAccountsLoading,
        isFetching: getAllAccountsFetching,
        data: accountsData,
    } = useGetAllAccountsQuery();
    const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);

    const { isError: isAccountsError, errorComponent: accountsErrorComponent }
        = useApiError(accountsError);
    const { isError: isFixedDepositsError, errorComponent: fixedDepositsErrorComponent }
        = useApiError(fixedDepositsError);
    const { isError: isProfilesError, errorComponent: profilesErrorComponent }
        = useApiError(profilesError);


    const filteredFixedDepositsData = useMemo(() => fixedDepositsData?.filter((fixedDeposit) => {
        return (
            enabledMap[fixedDeposit.profileId]
            && (!fixedDepositSearchText
                || fixedDeposit.fixedDepositName
                    .toLowerCase()
                    .includes(fixedDepositSearchText.toLowerCase()))
        )
    }), [fixedDepositsData, enabledMap, fixedDepositSearchText])

    if (
        getAllAccountsLoading
        || getAllAccountsFetching
        || getAllFixedDepositsLoading
        || getAllFixedDepositsFetching
        || deleteFixedDepositLoading
        || getAllProfilesLoading
        || getAllProfilesFetching
    ) {
        return <Spinner className="spinner" />
    }

    if (isAccountsError) {
        return accountsErrorComponent
    }
    if (isFixedDepositsError) {
        return fixedDepositsErrorComponent
    }
    if (isProfilesError) {
        return profilesErrorComponent
    }

    async function onSubmit(formData: z.infer<typeof fixedDepositFormSchema>) {
        console.log(formData);
        //   if (isUpdate) {
        //     await updateExistingProfile(formData)
        //   }
        //   else if (!isUpdate) {
        //     await saveNewProfile(formData)
        //   }
        //   else {
        //     toast.error('Unknown action, try again')
        //   }
    }

    const cancelDeleteFixedDeposit = () => {
        setDeleteFixedDepositDialogOpen(false)
    }

    const deleteCurrentFixedDeposit = async () => {
        if (currentFixedDeposit && currentFixedDeposit.fixedDepositId) {
            await deleteFixedDeposit(currentFixedDeposit.fixedDepositId).unwrap()
            toast.info(
                `Fixed deposit : ${currentFixedDeposit.fixedDepositName} deleted successfully!`,
            )
            setDeleteFixedDepositDialogOpen(false)
        }
        else {
            toast.error('Invalid fixed deposit! Please refresh the page')
        }
    }

    const handleDeleteFixedDeposit = (fixedDeposit: FixedDeposit) => {
        setDeleteFixedDepositDialogOpen(true)
        setCurrentFixedDeposit(fixedDeposit)
    }

    if (profilesData) {
        return (<div id="fixedDepositsSection">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Fixed Desposits</h1>
                <Input
                    type="search"
                    placeholder="Search fixed deposists by name..."
                    className="search-bar"
                    onChange={e => setFixedDepositSearchText(e.target.value)}
                />
                {accountsData && profilesData ? (
                    <AddFixedDepositForm
                        form={form}
                        onSubmit={onSubmit}
                        fixedDepositDialogOpen={fixedDepositDialogOpen}
                        setFixedDepositDialogOpen={setFixedDepositDialogOpen}
                        accounts={accountsData}
                        profiles={profilesData}
                    />
                )
                    : null}
            </div>
            <div className="normal-grid">
                {filteredFixedDepositsData
                    ? (
                        filteredFixedDepositsData.map(fixedDeposit => {
                            const profile = profilesData.find(profile => profile.profileId === fixedDeposit.profileId)
                            if (profile) {
                                return ((
                                    <FixedDepositSection
                                        fixedDeposit={fixedDeposit}
                                        profile={profile}
                                        handleDeleteFixedDeposit={handleDeleteFixedDeposit}
                                        key={fixedDeposit.fixedDepositId}
                                    />
                                ));
                            } else {
                                <Fragment key={fixedDeposit.fixedDepositId}>
                                </Fragment>
                            }
                        })
                    )
                    : (
                        <p className="text-muted-foreground text-sm">
                            Create a new fixed deposit here
                        </p>
                    )}
            </div>
            <AlertDialogComponent
                isDialogOpen={deleteFixedDepositDialogOpen}
                alertType="DELETE_FIXED_DEPOSIT"
                onSecondaryButtonClick={cancelDeleteFixedDeposit}
                onPrimaryButtonClick={deleteCurrentFixedDeposit}
            />
        </div>
        );
    }
}