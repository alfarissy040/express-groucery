import { z } from "zod";

const otpSchema = z.object({
    otp: z.string().min(1, {
        message: "OTP is Required!",
    }),
    username: z.string().min(1, {
        message: "Username is Required!",
    }),
})

export type TOtpSchema = z.infer<typeof otpSchema>

export default otpSchema