import { z } from "zod";

const resendOtpSchema = z.object({
    username: z.string().min(1, {
        message: "Username is Required!",
    }),
})

export default resendOtpSchema;