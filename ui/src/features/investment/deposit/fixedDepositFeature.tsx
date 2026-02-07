import { AlertDialogComponent } from '@/components/building-blocks/alertDialogComponent'
import { AddFixedDepositForm } from '@/components/building-blocks/forms/addFixedDepositForm'
import { FixedDepositSection } from '@/components/building-blocks/sections/fixedDepositSection'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useFixedDepositFeature } from '@/hooks/useFixedDepositFeature'
import type { FixedDeposit } from '@/types/FixedDeposit'
import { fixedDepositFormSchema } from '@/utilities/zodSchemas'
import { Fragment } from 'react'
import { toast } from 'sonner'
import type * as z from 'zod'

export function FixedDepositFeature() {
  const {
    fixedDepositDialogOpen,
    setFixedDepositDialogOpen,
    deleteFixedDeposit,
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
    profiles,
    accounts
  } = useFixedDepositFeature();

  if (
    isLoading
  ) {
    return <Spinner className="spinner" />
  }

  if (isError) {
    return errorComponent
  }

  async function onSubmit(formData: z.infer<typeof fixedDepositFormSchema>) {
    console.log(formData)
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

  if (profiles) {
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
          {accounts && profiles
            ? (
              <AddFixedDepositForm
                form={form}
                onSubmit={onSubmit}
                fixedDepositDialogOpen={fixedDepositDialogOpen}
                setFixedDepositDialogOpen={setFixedDepositDialogOpen}
                accounts={accounts}
                profiles={profiles}
              />
            )
            : null}
        </div>
        <div className="normal-grid">
          {filteredFixedDepositsData
            ? (
              filteredFixedDepositsData.map((fixedDeposit) => {
                const profile = profiles.find(profile => profile.profileId === fixedDeposit.profileId)
                if (profile) {
                  return ((
                    <FixedDepositSection
                      fixedDeposit={fixedDeposit}
                      profile={profile}
                      handleDeleteFixedDeposit={handleDeleteFixedDeposit}
                      key={fixedDeposit.fixedDepositId}
                    />
                  ))
                }
                else {
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
    )
  }
}
