import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import { useLoginMutation } from "@/services/authApi";
import { getCredentials, setCredentials } from "@/slices/authSlice";
import React from "react";
import { toast } from "sonner";

const formSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters long").max(20, "Username must be at most 20 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
});

type LoginFormProps = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function LoginForm({
    className,
    ...props
}: LoginFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const [login, { isLoading, isSuccess, error }] = useLoginMutation();
    const { isError, errorComponent } = useApiError(error);

    if (isLoading) return <Spinner />;
    if (isError) return errorComponent;

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        try {
            const result = await login({
                username: formData.username,
                password: formData.password
            }).unwrap();

            toast("Logged in as " + formData.username, {
                description: (
                    <pre
                        className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
                        style={{
                            background: "var(--background-code, #1a1a1a)",
                            color: "var(--foreground-code, #f5f5f5)",
                        }}
                    >
                        <code>Welcome to wealth tracker!</code>
                    </pre>
                ),
                position: "bottom-right",
                classNames: {
                    content: "flex flex-col gap-2",
                },
                style: {
                    "--border-radius": "calc(var(--radius)  + 4px)",
                    background: "var(--background, #fff)",
                    color: "var(--foreground, #000)",
                } as React.CSSProperties,
            });

            setCredentials({
                username: formData.username,
                token: result.accessToken,
            });

            console.log("token stored in redux as : ", getCredentials());
        } catch (err) {
            // error handling is done by useApiError
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your username"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            type="password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="form-rhf-demo">
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    )
}
