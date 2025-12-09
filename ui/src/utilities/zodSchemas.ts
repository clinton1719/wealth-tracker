import * as z from "zod";

export const profileFormSchema = z.object({
  id: z.number().optional(),
  profileName: z.string().min(1, "Profile name is required"),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters long")
    .optional(),
  colorCode: z
    .string()
    .min(4, "Color code must be valid")
    .max(7, "Color code must be valid"),
  profilePicture: z.string().optional(),
  profilePictureFile: z.instanceof(File).optional(),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  categoryName: z.string().min(1, "Category name is required"),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters long")
    .optional(),
  colorCode: z
    .string()
    .min(4, "Color code must be valid")
    .max(7, "Color code must be valid"),
  icon: z.string().optional(),
  profileName: z.string().min(1, "Profile is required"),
  tags: z.array(z.string()).optional(),
});

export const accountFormSchema = z.object({
  id: z.number().optional(),
  accountName: z.string().min(1, "Account name is required"),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters long")
    .optional(),
  accountBalance: z
    .number({ error: "Invalid input, please enter only numbers" })
    .nonnegative("Balance cannot be negative"),
  accountType: z.string().min(1, "Account type is required"),
  profileName: z.string().min(1, "Profile is required"),
});

export const expenseFormSchema = z.object({
  id: z.number().optional(),
  amount: z
    .number({ error: "Invalid input, please enter only numbers" })
    .nonnegative("Expense amount cannot be negative"),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters long")
    .optional(),
  categoryName: z.string().min(1, "Category is required"),
  accountName: z.string().min(1, "Account is required"),
  profileName: z.string().min(1, "Profile is required"),
});