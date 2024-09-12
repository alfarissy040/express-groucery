import otpEmailTemplate from "@/email/otpEmailTemplate";
import type { ZRegisterUser } from "@/schema/registerSchema";
import type { TCommonError } from "@/types";
import { hashPassword, signJWT } from "@/utility";
import prisma from "@/utility/prisma";
import transporter from "@/utility/transporter";
import type { Request, Response } from "express";
import moment from "moment";

const registerRoute = async (req: Request, res: Response) => {
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
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const token = signJWT({
            otp: otpCode,
            exp: moment().add(10, "m").valueOf(),
        })
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                name: name,
                password: hash,
                verificationToken: token
            },
        });

        await transporter.sendMail({
            from: 'no-reply <admin@groucery.com>',
            to: email,
            subject: "Your One-Time Password (OTP) for Groucery",
            html: otpEmailTemplate.replace("{{OTP_CODE}}", otpCode.toString()),
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
}

export default registerRoute