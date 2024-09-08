import { Router } from "express";
import authRouter from "./auth";

const router = Router();

router.use("/auth", authRouter);

const routerV1 = router;
export default routerV1;
