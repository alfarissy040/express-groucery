import validate from "@/middleware/validate";
import type { TCommonError } from "@/types";
import { hashPassword, signJWT } from "@/utility";
import prisma from "@/utility/prisma";
import { compare } from "bcryptjs";
import { type Request, type Response, Router } from "express";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
	username: z.string().min(1, {
		message: "Username is Required!",
	}),
	password: z.string().min(1, {
		message: "Password is Required!",
	}),
});

const registerSchema = z.object({
	username: z.string().min(1, {
		message: "Username cannot be empty. Please enter your username.",
	}),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 characters long." }),
	email: z
		.string()
		.min(1, {
			message: "Email cannot be empty. Please provide a valid email address.",
		})
		.email({ message: "Please enter a valid email address." }),
	name: z
		.string()
		.min(1, { message: "Name cannot be empty. Please enter your full name." }),
});

type ZLoginUser = z.infer<typeof loginSchema>;
type ZRegisterUser = z.infer<typeof registerSchema>;

router.post(
	"/login",
	validate(loginSchema),
	async (req: Request, res: Response) => {
		const body: ZLoginUser = req.body;
		const { username, password } = body;

		try {
			const user = await prisma.user.findFirst({
				where: {
					username: username,
				},
			});
			if (!user) throw { status: 404, message: "User not found!" };

			const checkPassword = await compare(password, user.password);
			if (!checkPassword) throw { status: 401, message: "User invalid!" };

			const token = signJWT({
				name: user.name,
				email: user.email,
				username: user.username,
				role: user.role,
			});

			res.cookie("jwt", token, {
				httpOnly: true,
				secure: true,
				maxAge: 24 * 3600, // 1 day
			});
			return res.status(202);
		} catch (err) {
			const error = err as TCommonError;
			return res
				.status(error.status ?? 500)
				.json({ message: error.message ?? "Somenthing went wrong!" });
		}
	},
);

router.post(
	"/register",
	validate(registerSchema),
	async (req: Request, res: Response) => {
		const body: ZRegisterUser = req.body;
		const { name, username, email, password } = body;

		try {
			const isUnique = await prisma.user.findFirst({
				select: { username: true, email: true },
				where: { OR: [{ username: username }, { email: email }] },
			});

			if (isUnique) {
				const errorValidateUnique: Partial<
					Record<"username" | "email", string>
				> = {};
				if (isUnique?.username)
					errorValidateUnique.username = "Username is already taken!";
				if (isUnique?.email)
					errorValidateUnique.email = "Email is already in use!";
				throw {
					status: 401,
					errors: errorValidateUnique,
				};
			}

			const hash = await hashPassword(password);
			await prisma.user.create({
				data: {
					username: username,
					email: email,
					name: name,
					password: hash,
				},
			});

			return res
				.status(202)
				.json({ message: "A verification email has been sent to your inbox." });
		} catch (err) {
			const error = err as TCommonError;
			return res.status(error.status ?? 500).json({
				status: error.status,
				error: error.errors,
				message: error.message ?? "Somenthing went wrong!",
			});
		}
	},
);

const authRouter = router;
export default authRouter;
