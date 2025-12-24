import type { Account } from '@/types/Account'
import type { AddExpenseFormProps } from '@/types/AddExpenseFormProps'
import type { Category } from '@/types/Category'
import { PlusCircle } from 'lucide-react'

import { DynamicIcon } from 'lucide-react/dynamic'
import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defaultExpense } from '@/utilities/constants'

export function AddExpenseForm({
  expenseDialogOpen,
  setExpenseDialogOpen,
  isUpdate,
  setIsUpdate,
  form,
  onSubmit,
  profiles,
  accounts,
  categories,
}: AddExpenseFormProps) {
  const { watch } = form

  const profileName = watch('profileName')
  const profile = profiles.find(
    profile => profile.profileName === profileName,
  )

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter')
      e.preventDefault()
  }

  let filteredAccounts
  let filteredCategories

  if (profile) {
    filteredAccounts = accounts.filter(
      account => account.profileId === profile.profileId,
    )
    filteredCategories = categories.filter(
      category => category.profileId === profile.profileId,
    )
  }

  return (
    <Dialog open={expenseDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setExpenseDialogOpen(true)
            setIsUpdate(false)
          }}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Expense
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onClickMethod={() => {
          setExpenseDialogOpen(false)
          setIsUpdate(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
        </DialogHeader>
        <DialogDescription>Use this form to create expenses</DialogDescription>
        <form
          id="form-rhf-expense"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={e => checkKeyDown(e)}
        >
          <FieldGroup>
            <Controller
              name="expenseDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-expense-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-expense-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter expense description"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="expenseAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-expense-amount">
                    Expense amount
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-expense-amount"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter account balance"
                    autoComplete="off"
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
                    disabled={isUpdate === true}
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
            {filteredAccounts
              ? (
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
                          disabled={
                            isUpdate === true || !form.getValues('profileName')
                          }
                        >
                          <SelectTrigger
                            id="form-rhf-select-profile"
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {filteredAccounts.map((account: Account) => (
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
                  />
                )
              : (
                  null
                )}
            {filteredCategories
              ? (
                  <Controller
                    name="categoryName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="responsive"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldLabel htmlFor="form-rhf-select-category">
                            Category
                          </FieldLabel>
                          <FieldDescription>Choose your category</FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!form.getValues('profileName')}
                        >
                          <SelectTrigger
                            id="form-rhf-select-profile"
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {filteredCategories.map((category: Category) => (
                              <SelectItem
                                key={category.categoryId}
                                value={category.categoryName}
                              >
                                <DynamicIcon
                                  name={
                                    category.categoryIcon
                                      ? category.categoryIcon
                                      : ('badge-check' as any)
                                  }
                                  color={category.categoryColorCode}
                                />
                                {category.categoryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                )
              : (
                  null
                )}
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultExpense)}
              >
                Reset
              </Button>
              <Button form="form-rhf-expense">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
