import validate from "@/src/middleware/validate";
import loginSchema from "@/src/schema/loginSchema";
import otpSchema from "@/src/schema/otpSchema";
import registerSchema from "@/src/schema/registerSchema";
import { Router } from "express";
import loginRoute from "./login/route";
import registerRoute from "./register/route";
import otpVerify from "./verify/route";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginRoute)
authRouter.post("/register", validate(registerSchema), registerRoute);
authRouter.post("/otp", validate(otpSchema), otpVerify);

export default authRouter;
