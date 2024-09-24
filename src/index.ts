import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import path from "node:path";
import routerV1 from "./v1";

dotenv.config();

const app = express();
const corsOptions: CorsOptions = {
	origin: "127.0.0.1", // Ganti dengan URL frontend Anda
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true, // Jika menggunakan cookie
};
// Konfigurasi rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 menit
	max: 100, // Batasi setiap IP maksimal 100 permintaan per windowMs
	message: "Too many requests, please try again later.",
});

process.env.NODE_ENV === "production" && app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT || 3000;

app.use("/v1/", routerV1);

app.use("/public/images", express.static(path.join(__dirname, "public/images")));

// 404 not found
app.use((req: Request, res: Response) => {
	return res.status(404).json({ message: "Route Not Found!" });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
