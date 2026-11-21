import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must have 6 characters at least")
});

export const signUpSchema = z.object({
    username: z.string().min(2, "Username must have 2 characters at least"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must have 6 characters at least"),
    confirmPassword: z.string().min(1, "Confirm your password")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const languages = ["JavaScript", "TypeScript", "Python", "C#"] as const;

export const developerSchema = z.object({
    name: z.string().min(2, "Name must have 2 characters at least"),
    age: z.coerce.number("Age must be a number")
        .min(18, "Minimal age is 18")
        .max(65, "Maximum age is 65"),
    language: z.enum(languages, { message: "Choose a programming language" })
});

export const ratingSchema = z.object({
    rating: z.coerce.number("Choose a rating")
        .min(1, "Choose a rating from 1 to 5")
        .max(5, "Choose a rating from 1 to 5"),
    comment: z.string().min(5, "Comment must have 5 characters at least")
        .optional().or(z.literal(""))
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type DeveloperForm = z.infer<typeof developerSchema>;
export type RatingForm = z.infer<typeof ratingSchema>;
