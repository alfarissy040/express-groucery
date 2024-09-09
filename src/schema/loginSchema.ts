import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is Required!",
    }),
    password: z.string().min(1, {
        message: "Password is Required!",
    }),
});

export type ZLoginUser = z.infer<typeof loginSchema>;

export default loginSchema