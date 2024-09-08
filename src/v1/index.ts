import validate from "@/middleware/validate";
import type { TCommonError } from "@/types";
import { signJWT } from "@/utility";
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

type ZUser = z.infer<typeof loginSchema>;

router.post(
	"/login",
	validate(loginSchema),
	async (req: Request, res: Response) => {
		const { username, password } = req.body as unknown as ZUser;

		try {
			const user = await prisma.user.find({
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
			return res.status(error.status).json({ message: error.message });
		}
	},
);

const routerV1 = router;
export default routerV1;
