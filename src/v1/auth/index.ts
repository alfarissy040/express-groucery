import validate from "@/src/middleware/validate";
import loginSchema from "@/src/schema/loginSchema";
import otpSchema from "@/src/schema/otpSchema";
import registerSchema from "@/src/schema/registerSchema";
import resendOtpSchema from "@/src/schema/resendOtpSchema";
import { Router } from "express";
import loginRoute from "./login/route";
import resendOtp from "./otp/resend/route";
import otpVerify from "./otp/route";
import registerRoute from "./register/route";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginRoute)
authRouter.post("/register", validate(registerSchema), registerRoute);
authRouter.post("/otp", validate(otpSchema), otpVerify);
authRouter.post("/otp/resend", validate(resendOtpSchema), resendOtp);

export default authRouter;
