import { IconsComboBox } from "@/components/building-blocks/iconsComboBox"
import { Badge } from '@/components/ui/badge'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useApiError } from "@/hooks/use-api-error"
import { useGetAllCategoriesQuery, useSaveCategoryMutation, useUpdateCategoryMutation } from "@/services/categoriesApi"
import type { Category } from "@/types/Category"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@radix-ui/react-dialog"
import { PlusCircle, XIcon } from "lucide-react"
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().max(100, "Description must be at most 100 characters long").optional(),
    colorCode: z.string().min(4, "Color code must be valid").max(7, "Color code must be valid"),
    icon: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export default function ViewCategories() {
    const [tags, setTags] = useState<string[]>([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            description: "",
            colorCode: "#000000",
            icon: "",
            tags: []
        },
    });

    const [saveCategory, { isLoading: saveCategoryLoading }] = useSaveCategoryMutation();
    const [updateCategory, { isLoading: updateCategoryLoading }] = useUpdateCategoryMutation();
    const { error, isLoading: getAllCategoriesLoading, data } = useGetAllCategoriesQuery();
    const { isError, errorComponent } = useApiError(error);

    if (saveCategoryLoading || getAllCategoriesLoading || updateCategoryLoading) {
        return <Spinner />;
    }

    if (isError) {
        return errorComponent;
    }

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        console.log(formData);
        if (isUpdate) {
            await updateExistingCategory(formData);
        } else if (!isUpdate) {
            await saveNewCategory(formData);
        } else {
            toast.error("Unknown action, try again");
        }
    }

    async function saveNewCategory(formData: z.infer<typeof formSchema>) {
        try {
            const result = await saveCategory({ ...formData, tags }).unwrap();

            toast("Category saved!", {
                description: (
                    <pre
                        className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
                        style={{
                            background: "var(--background-code, #1a1a1a)",
                            color: "var(--foreground-code, #f5f5f5)",
                        }}
                    >
                        <code>Category name: {result.name}</code>
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

            setFormDialogOpen(false);
        } catch (error: any) {
            console.log(error)
            if (error?.originalStatus === 409) {
                toast.error("Category already exists with name: " + formData.name);
            } else if (error?.originalStatus === 400) {
                toast.error("Invalid input. Please check your details.");
            } else if (error?.originalStatus === 404) {
                toast.error("This resource does not exist, kindly refresh your page.");
            } else if (error?.originalStatus === 403) {
                toast.error("Access denied. You do not have permission to access this resource.");
            } else {
                toast.error("Failed to create category, please try again");
            }
        }
    }

    async function updateExistingCategory(formData: z.infer<typeof formSchema>) {
        try {
            const result = await updateCategory({ ...formData, tags }).unwrap();

            if (!result) {
                toast.error("Failed to update category, please try again later");
                return;
            }

            toast("Category updated!", {
                description: (
                    <pre
                        className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
                        style={{
                            background: "var(--background-code, #1a1a1a)",
                            color: "var(--foreground-code, #f5f5f5)",
                        }}
                    >
                        <code>Category name: {result.name}</code>
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

            setIsUpdate(false);
            setFormDialogOpen(false);
        } catch (error: any) {
            if (error?.originalStatus === 409) {
                toast.error("Category already exists with name: " + formData.name);
            } else if (error?.originalStatus === 400) {
                toast.error("Invalid input. Please check your details.");
            } else if (error?.originalStatus === 403) {
                toast.error("Access denied. You do not have permission to access this resource.");
            } else if (error?.originalStatus === 404) {
                toast.error("This resource does not exist, kindly refresh your page.");
            } else {
                toast.error("Failed to create category, please try again");
            }
        }
    }

    const checkKeyDown = (e: any) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    const handleUpdateCategory = (category: Category) => {
        form.reset(category);
        console.log(category);
        setFormDialogOpen(true);
        setIsUpdate(true);
    }

    if (data) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Dialog open={formDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {setFormDialogOpen(true)}}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                New Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md" onClickMethod={() => setFormDialogOpen(false)}>
                            <DialogHeader>
                                <DialogTitle>Create Category</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Use this form to create categories
                            </DialogDescription>
                            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
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
                                                    placeholder="Press 'ENTER' after adding each tag"
                                                    autoComplete="off"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && inputValue.trim() !== '') {
                                                            setTags([...tags, inputValue.trim()]);
                                                            form.setValue("tags", [...tags, inputValue.trim()])
                                                            setInputValue('');
                                                        }
                                                    }}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {form.getValues("tags") ? form.getValues("tags")?.map((tag, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                className="ml-2 text-destructive"
                                                                onClick={() => {
                                                                    const newTags = tags.filter(_tag => _tag !== tag)
                                                                    setTags(newTags);
                                                                }}
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    )) : tags.map((tag, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                className="ml-2 text-destructive"
                                                                onClick={() => {
                                                                    const newTags = tags.filter(_tag => _tag !== tag)
                                                                    setTags(newTags);
                                                                }}
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </Field>
                                        )}
                                    />
                                    <Field orientation="horizontal">
                                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                                            Reset
                                        </Button>
                                        <Button form="form-rhf-demo">
                                            Submit
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {data.map((category) => (
                        <Card key={category.id} className="hover:shadow-md transition flex justify-between">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 break-all">
                                    <DynamicIcon name={category.icon ?? "badge-check" as unknown as any} color={category.colorCode} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.colorCode }} />
                                    {category.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="mb-2">
                                <p className="text-sm text-muted-foreground mb-4 break-all">{category.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {category.tags?.map((tag, index) => (
                                        <Badge key={index} variant="outline" style={{ color: category.colorCode }}>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex-row gap-2 justify-between">
                                <Button variant={"ghost"} onClick={() => handleUpdateCategory(category)}>
                                    <DynamicIcon name="edit" color={category.colorCode} className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant={"ghost"}>
                                    <DynamicIcon name="trash" color={category.colorCode} className="h-4 w-4" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }


}
