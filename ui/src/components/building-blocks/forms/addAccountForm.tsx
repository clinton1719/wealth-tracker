import type { AddAccountFormProps } from "@/types/AddAccountFormProps";
import { PlusCircle } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { defaultAccount } from "@/utilities/constants";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddAccountForm({
    profiles,
    accountDialogOpen,
    setAccountDialogOpen,
    form,
    onSubmit,
}: AddAccountFormProps) {
    const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") e.preventDefault();
    };

    return (
        <Dialog open={accountDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => {
                        setAccountDialogOpen(true);
                    }}
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Account
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-md"
                onClickMethod={() => setAccountDialogOpen(false)}
            >
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>Use this form to create accounts</DialogDescription>
                <form
                    id="form-rhf-account"
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={(e) => checkKeyDown(e)}
                >
                    <FieldGroup>
                        <Controller
                            name="accountName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-account-name">
                                        Account name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-account-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter account name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-account-description">
                                        Description
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-account-description"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter account description"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="accountType"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    orientation="responsive"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldContent>
                                        <FieldLabel htmlFor="form-rhf-select-language">
                                            Account type
                                        </FieldLabel>
                                        <FieldDescription>
                                            Choose your bank account type
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
                                            id="form-rhf-select-language"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-[120px]"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            <SelectSeparator />
                                            <SelectItem key={"savings"} value={"SAVINGS"}>
                                                Savings
                                            </SelectItem>
                                            <SelectItem key={"current"} value={"CURRENT"}>
                                                Current
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
                                        <FieldLabel htmlFor="form-rhf-select-account-type">
                                            Account type
                                        </FieldLabel>
                                        <FieldDescription>
                                            Choose your bank account type
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
                                            id="form-rhf-select-profile"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-[120px]"
                                        >
                                            <SelectValue placeholder="Select profile" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {profiles.map(profile => (
                                                <SelectItem key={profile.id} value={profile.profileName}>
                                                    {profile.profileName}
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                        <Controller
                            name="accountBalance"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-account-balance">
                                        Account balance
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-account-balance"
                                        type="number"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter account balance"
                                        autoComplete="off"
                                        min={0}
                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field orientation="horizontal">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset(defaultAccount)}
                            >
                                Reset
                            </Button>
                            <Button form="form-rhf-account">Submit</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
