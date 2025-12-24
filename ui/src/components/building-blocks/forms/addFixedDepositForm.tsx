import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AddFixedDepositFormProps } from "@/types/AddFixedDepositFormProps"
import { defaultFixedDeposit } from "@/utilities/constants"
import { PlusCircle } from "lucide-react"
import { Controller } from "react-hook-form"
import { CalendarComponent } from "../calendar"

export function AddFixedDepositForm({ form, fixedDepositDialogOpen, setFixedDepositDialogOpen, onSubmit, accounts, profiles }: AddFixedDepositFormProps) {
  const { watch } = form;

  const profileName = watch('profileName')
  const profile = profiles.find(
    profile => profile.profileName === profileName,
  )

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter')
      e.preventDefault()
  }

  let filteredAccounts

  if (profile) {
    filteredAccounts = accounts.filter(
      account => account.profileId === profile.profileId,
    )
  }

  return (
    <Dialog open={fixedDepositDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setFixedDepositDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New fixed deposit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onClickMethod={() => {
          setFixedDepositDialogOpen(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Create fixed deposit</DialogTitle>
        </DialogHeader>
        <DialogDescription>Use this form to create fixed deposits</DialogDescription>
        <form
          id="form-rhf-fixedDeposit"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={e => checkKeyDown(e)}
        >
          <FieldGroup>
            <Controller
              name="fixedDepositName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-fixedDeposit-name">
                    Fixed deposit name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-fixedDeposit-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter fixed deposit name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="fixedDepositPrincipal"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-fixedDeposit-principal">
                    Principal
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-fixedDeposit-principal"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter principal amount"
                    autoComplete="off"
                    type="number"
                    min={0}
                    step="any"
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="fixedDepositInterestRate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-fixedDeposit-interest-rate">
                    Interest rate
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-fixedDeposit-interest-rate"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter interest rate (%)"
                    autoComplete="off"
                    type="number"
                    min={0}
                    step="any"
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                  (%)
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="fixedDepositTenure"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-fixedDeposit-tenure">
                      Tenure
                    </FieldLabel>
                    <FieldDescription>
                      Choose how long the amount is invested for
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-fixedDeposit-tenure"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem key="years" value="years">
                        Years
                      </SelectItem>
                    </SelectContent>
                    <SelectContent position="item-aligned">
                      <SelectItem key="months" value="months">
                        Months
                      </SelectItem>
                    </SelectContent>
                    <SelectContent position="item-aligned">
                      <SelectItem key="days" value="days">
                        Days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="profileName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-profile">
                      Profile
                    </FieldLabel>
                    <FieldDescription>Choose your profile</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-profile"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {profiles.map(profile => (
                        <SelectItem
                          key={profile.profileId}
                          value={profile.profileName}
                        >
                          {profile.profileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            {filteredAccounts ? (<Controller
              name="accountName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-account-type">
                      Account
                    </FieldLabel>
                    <FieldDescription>Choose your account</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-account"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {accounts.map(account => (
                        <SelectItem
                          key={account.accountId}
                          value={account.accountName}
                        >
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />) : null}
            <Controller
              name="fixedDepositStartDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-fixedDeposit-startDate">
                      Start date
                    </FieldLabel>
                    <FieldDescription>Pick start date of deposit</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <CalendarComponent date={field.value} setDate={field.onChange} label="Start date" />
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultFixedDeposit)}
              >
                Reset
              </Button>
              <Button form="form-rhf-fixedDeposit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}