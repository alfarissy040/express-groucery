import validate from "@/middleware/validate";
import loginSchema from "@/schema/loginSchema";
import registerSchema from "@/schema/registerSchema";
import { Router } from "express";
import loginRoute from "./login/route";
import registerRoute from "./register/route";
import verifyEmailRoute from "./verify/route";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginRoute)
authRouter.post("/register", validate(registerSchema), registerRoute);
authRouter.get("/verify/:token", verifyEmailRoute);

export default authRouter;
