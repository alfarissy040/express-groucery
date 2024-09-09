import { hash } from "bcryptjs";
import jwt, { decode, type JWT } from "jsonwebtoken";

export const signJWT = (data: Record<string, any>, expired?: string | number) =>
	jwt.sign(data, process.env.SECRET as string, {
		expiresIn: expired ?? "1 days",
	});

export const decodeJWT = (token: string) => {
	try {
		return decode(token, { json: true }) as JWT;
	} catch (error) {
		throw { status: 401, message: "Invalid token" };
	}
};

export const hashPassword = async (password: string) => {
	return await hash(password, 16);
};
