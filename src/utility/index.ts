import path from "node:path";
import { hash } from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import multer from "multer";

export const signJWT = (data: Record<string, any>, options?: jwt.SignOptions) =>
	jwt.sign(data, process.env.SECRET as string, {
		...options,
	});

export const decodeJWT = (token: string) => {
	try {
		return decode(token, { json: true });
	} catch (error) {
		throw { status: 401, message: "Invalid token" };
	}
};

export const hashPassword = async (password: string) => {
	return await hash(password, 16);
};

export const imageStorage = multer.diskStorage({
	destination: "./src/public/images",
	filename(req, file, callback) {
		callback(
			null,
			`${file.filename}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
})

export const baseUrl = process.env.BASE_URL as string ?? "http://localhost:3000"