import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(1, {
        message: "Username cannot be empty. Please enter your username.",
    }),
    password: z
        .string()
        .min(4, { message: "Password must be at least 4 characters long." }),
    email: z
        .string()
        .min(1, {
            message: "Email cannot be empty. Please provide a valid email address.",
        })
        .email({ message: "Please enter a valid email address." }),
    name: z
        .string()
        .min(1, { message: "Name cannot be empty. Please enter your full name." }),
});

export type ZRegisterUser = z.infer<typeof registerSchema>;

export default registerSchema