import type { ZLoginUser } from "@/src/schema/loginSchema";
import type { TCommonError } from "@/src/types";
import { signJWT } from "@/src/utility";
import prisma from "@/src/utility/prisma";
import { compare } from "bcryptjs";
import type { Request, Response } from "express";
import moment from "moment";

const loginRoute = async (req: Request, res: Response) => {
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
            exp: moment().add(24, "h").valueOf(),
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 3600,
        });
        return res.status(200).send({ message: "Login success!" });
    } catch (err) {
        const error = err as TCommonError;
        return res
            .status(error.status ?? 500)
            .json({ message: error.message ?? "Somenthing went wrong!" });
    }
}

export default loginRoute;