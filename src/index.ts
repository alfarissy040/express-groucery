import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import moment from "moment";
import routerV1 from "./v1";

dotenv.config();

const app = express();
const corsOptions: CorsOptions = {
	origin: "http://your-frontend-url.com", // Ganti dengan URL frontend Anda
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

app.get("/", (req: Request, res: Response) => {
	const qPage = req.query.page;
	const token = jwt.sign(
		{
			message: "hi there",
			page: qPage,
		},
		process.env.SECRET as string,
		{
			expiresIn: "1d",
		},
	);

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: true,
		maxAge: 24 * 3600, // 1 day
	});

	res.json({ message: "hi there" });
});

app.use("/v1/", routerV1);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
