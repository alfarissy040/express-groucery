import { type Request, type Response, Router } from "express";
import authRouter from "./auth";
import productRouter from "./products/route";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter)

const routerV1 = router;
export default routerV1;
