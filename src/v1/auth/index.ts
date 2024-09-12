import validate from "@/middleware/validate";
import loginSchema from "@/schema/loginSchema";
import registerSchema from "@/schema/registerSchema";
import { Router } from "express";
import loginRoute from "./login/route";
import registerRoute from "./register/route";
import otpVerify from "./verify/route";
import otpSchema from "@/schema/otpSchema";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginRoute)
authRouter.post("/register", validate(registerSchema), registerRoute);
authRouter.post("/otp", validate(otpSchema), otpVerify);

export default authRouter;
