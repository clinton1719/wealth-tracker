import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Account } from "@/types/Account"
import type { AddFixedDepositFormProps } from "@/types/AddFixedDepositFormProps"
import { defaultFixedDeposit, FIXED_DEPOSIT_DAY_GROUPS, FIXED_DEPOSIT_MONTHS, FIXED_DEPOSIT_YEAR_GROUPS } from "@/utilities/constants"
import { PlusCircle } from "lucide-react"
import { Controller } from "react-hook-form"
import { CalendarComponent } from "../calendar"

export function AddFixedDepositForm({ form, fixedDepositDialogOpen, setFixedDepositDialogOpen, onSubmit, accounts, profiles }: AddFixedDepositFormProps) {
  const { watch, formState: {errors} } = form;

  const fixedDepositYearsError = errors.fixedDepositYears;
  const fixedDepositMonthsError = errors.fixedDepositYears;
  const fixedDepositDaysError = errors.fixedDepositYears;

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
          <FieldGroup className="gap-3">
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
                    Interest rate (%)
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldContent>
              <FieldLabel htmlFor="form-rhf-select-fixedDeposit-tenure">
                Tenure
              </FieldLabel>
              <FieldDescription>
                Choose how long the amount is invested for
              </FieldDescription>
              {fixedDepositYearsError && fixedDepositMonthsError && fixedDepositDaysError ? (
                <FieldError errors={[(fixedDepositYearsError ?? fixedDepositMonthsError) ?? fixedDepositDaysError]} />
              ) : null}
            </FieldContent>
            <div className="flex justify-between">
              <Controller
                name="fixedDepositYears"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "flex" : ""}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-fixedDeposit-tenure"
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {FIXED_DEPOSIT_YEAR_GROUPS.map(yearGroup => (
                          <SelectGroup>
                            <SelectLabel>{yearGroup.groupLabel}</SelectLabel>
                            {
                              yearGroup.years.map(year => (
                                <SelectItem value={year} key={year}>{year}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="fixedDepositMonths"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-fixedDeposit-tenure"
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Months" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {FIXED_DEPOSIT_MONTHS.map(month => (<SelectItem value={month} key={month}>{month}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="fixedDepositDays"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-fixedDeposit-tenure"
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Days" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {FIXED_DEPOSIT_DAY_GROUPS.map(dayGroup => (
                          <SelectGroup>
                            <SelectLabel>{dayGroup.groupLabel}</SelectLabel>
                            {
                              dayGroup.days.map(day => (
                                <SelectItem value={day} key={day}>{day}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
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
            {filteredAccounts ?
              (<Controller
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
                        {filteredAccounts.map((filteredAccount: Account) => (
                          <SelectItem
                            key={filteredAccount.accountId}
                            value={filteredAccount.accountName}
                          >
                            {filteredAccount.accountName}
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