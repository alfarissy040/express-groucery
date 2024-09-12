import { hash } from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";

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
