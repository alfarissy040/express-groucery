import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

export const signJWT = (data: Record<string, any>) =>
	jwt.sign(data, process.env.SECRET as string, {
		expiresIn: "1 days",
	});

export const hashPassword = async (password: string) => {
	return await hash(password, 16);
};
