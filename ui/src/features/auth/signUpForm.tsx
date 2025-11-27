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
    FieldDescription,
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
import { useSignUpMutation } from "@/services/authApi";
import React from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const formSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters long").max(20, "Username must be at most 20 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords must match",
        path: ["confirmPassword"],
    }
);

type SignUpFormProps = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function SignUpForm({
    className,
    ...props
}: SignUpFormProps) {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [signUp, { isLoading }] = useSignUpMutation();

    if (isLoading) return <Spinner />;

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        try {
            await signUp({
                username: formData.username,
                password: formData.password,
            }).unwrap();

            toast("Sign up successful for " + formData.username, {
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
            toast.success("Your account has been created successfully. Please log in.");
            navigate("/login");
        } catch (error: any) {
            if (error?.originalStatus === 409) {
                toast.error("Username already exists. Please try another one.");
            } else if (error?.originalStatus === 400) {
                toast.error("Invalid input. Please check your details.");
            } else {
                toast.error("Sign up failed. Please try again later.");
            }
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create a new account</CardTitle>
                    <CardDescription>
                        Enter a username and password to sign up.
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
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-confirm-password"
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
                    <Field orientation="vertical">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="form-rhf-demo">
                            Submit
                        </Button>
                        <FieldDescription className="px-6 text-center">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </FieldDescription>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    )
}
