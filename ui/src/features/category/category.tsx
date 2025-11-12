import { IconsComboBox } from "@/components/building-blocks/iconsComboBox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Category } from "@/types/Category"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().max(100, "Description must be at most 100 characters long").optional(),
    colorCode: z.string().min(4, "Color code must be valid").max(7, "Color code must be valid"),
    icon: z.string().optional(),
    tags: z.string().optional(),
});

export default function Category() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            description: "",
            colorCode: "#000000",
            icon: "",
        },
    });

    const [categories, setCategories] = useState<Category[]>([
        {
            id: "1",
            name: "Food",
            description: "random",
            colorCode: "#F97316",
            tags: ["groceries", "dining"],
        },
        {
            id: "2",
            name: "Travel",
            description: "Flights, taxis, fuel",
            colorCode: "#3B82F6",
            tags: ["flights", "accommodation"],
        },
        {
            id: "3",
            name: "Shopping",
            description: "Clothes, electronics, gifts",
            colorCode: "#10B981",
            tags: ["clothes", "electronics"],
        },
        {
            id: "4",
            name: "Shopping",
            description: "Clothes, electronics, gifts",
            colorCode: "#10B981",
            tags: ["clothes", "electronics"],
        }
    ])

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        try {
            console.log("Form Data:", formData);
        } catch (error: any) {

        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                        </DialogHeader>
                        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter category name"
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
                                            <FieldLabel htmlFor="form-rhf-demo-description">
                                                Description
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-description"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter category description"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="colorCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-color">
                                                Color
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-color"
                                                aria-invalid={fieldState.invalid}
                                                type="color"
                                                className="w-12 h-10 p-1 cursor-pointer"
                                            />
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-colorCode"
                                                aria-invalid={fieldState.invalid}
                                                className="flex-1"
                                                placeholder="#FF5733"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="icon"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="form-rhf-demo-icon">
                                                Icon
                                            </FieldLabel>
                                            <FieldDescription>
                                                Select an icon for the category
                                            </FieldDescription>
                                            <IconsComboBox field={field} fieldState={fieldState} form={form} />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="tags"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-tags">
                                                Tags
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-tags"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter category tags with commas"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Field orientation="horizontal">
                                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                                        Reset
                                    </Button>
                                    <Button type="submit" form="form-rhf-demo">
                                        Submit
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorCode }} />
                                {category.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2 break-all">{category.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
