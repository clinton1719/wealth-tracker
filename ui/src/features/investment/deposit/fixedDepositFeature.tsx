import { AddFixedDepositForm } from "@/components/building-blocks/forms/addFixedDepositForm";
import { Input } from "@/components/ui/input";
import type * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { fixedDepositFormSchema } from "@/utilities/zodSchemas";
import { defaultFixedDeposit } from "@/utilities/constants";
import { useMemo, useState } from "react";
import { useGetAllAccountsQuery } from "@/services/accountsApi";
import { useSelector } from "react-redux";
import { selectProfileSlice } from "@/slices/profileSlice";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import type { FixedDeposit } from "@/types/FixedDeposit";
import { toast } from "sonner";
import { useGetAllFixedDepositsQuery } from "@/services/fixedDepositsApi";

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
        error: fixedDepositsError,
        isLoading: getAllFixedDepositsLoading,
        isFetching: getAllFixedDepositsFetching,
        data: fixedDepositsData,
    } = useGetAllFixedDepositsQuery();
    const {
        error: accountsError,
        isLoading: getAllAccountsLoading,
        isFetching: getAllAccountsFetching,
        data: accountsData,
    } = useGetAllAccountsQuery();
    const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);

    const { isError: isAccountsError, errorComponent: accountsErrorComponent }
        = useApiError(accountsError);

    if (
        getAllAccountsLoading
        || getAllAccountsFetching
    ) {
        return <Spinner className="spinner" />
    }

    if (isAccountsError) {
        return accountsErrorComponent
    }

    const filteredFixedDepositsData = useMemo(() => fixedDepositsData?.filter((fixedDeposit) => {
        return (
            enabledMap[fixedDeposit.fixedDepositId]
            && (!fixedDepositSearchText
                || fixedDeposit.fixedDepositName
                    .toLowerCase()
                    .includes(fixedDepositSearchText.toLowerCase()))
        )
    }), [accountsData, enabledMap, fixedDepositSearchText])

    async function onSubmit(formData: z.infer<typeof fixedDepositFormSchema>) {
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
            // await deleteFixedDeposit(currentFixedDeposit.accountId).unwrap()
            toast.info(
                `Fixed deposit : ${currentFixedDeposit.fixedDepositName} deleted successfully!`,
            )
            setDeleteFixedDepositDialogOpen(false)
        }
        else {
            toast.error('Invalid account! Please refresh the page')
        }
    }

    const handleDeleteFixedDeposit = (fixedDeposit: FixedDeposit) => {
        setDeleteFixedDepositDialogOpen(true)
        setCurrentFixedDeposit(fixedDeposit)
    }

    return (
        <div id="fixedDepositsSection">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Fixed Desposits</h1>
                <Input
                    type="search"
                    placeholder="Search fixed deposists by name..."
                    className="search-bar"
                    onChange={e => setFixedDepositSearchText(e.target.value)}
                />
                {accountsData ? (
                    <AddFixedDepositForm
                        form={form}
                        onSubmit={onSubmit}
                        fixedDepositDialogOpen={fixedDepositDialogOpen}
                        setFixedDepositDialogOpen={setFixedDepositDialogOpen}
                        accounts={accountsData}
                    />
                )
                    : null}
            </div>
            <div className="normal-grid">
                {filteredFixedDepositsData
                    ? (
                        filteredFixedDepositsData.map(fixedDeposit => (
                            <FixedDepositSection
                                fixedDeposit={fixedDeposit}
                                key={fixedDeposit.fixedDepositId}
                                form={form}
                                setFixedDepositDialogOpen={setFixedDepositDialogOpen}
                                handleDeleteFixedDeposit={handleDeleteFixedDeposit}
                            />
                        ))
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
    )
}