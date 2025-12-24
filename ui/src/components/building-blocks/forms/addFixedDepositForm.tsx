import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller } from "react-hook-form"
import { CalendarComponent } from "../calendar"

export function AddFixedDepositForm() {
    return (
    <Dialog open={fixedDepositDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setProfileDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New fixed deposit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onClickMethod={() => {
          setProfileDialogOpen(false)
          setIsUpdate(false)
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
                    disabled={isUpdate === true}
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
                          key={account.profileId}
                          value={account.profileName}
                        >
                          {account.profileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="accountName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-account-type">
                      Start date
                    </FieldLabel>
                    <FieldDescription>Pick start date of deposit</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <CalendarComponent date={from} setDate={setFrom(field)} label="Start date"/>
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