import otpEmailTemplate from "@/src/email/otpEmailTemplate";
import type { TCommonError } from "@/src/types";
import { signJWT } from "@/src/utility";
import prisma from "@/src/utility/prisma";
import transporter from "@/src/utility/transporter";
import type { Request, Response } from "express";
import moment from "moment";

const resendOtp = async (req: Request, res: Response) => {
    const { username } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { username: username } });
        if (!user) throw ({ status: 404, message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const token = signJWT({
            otp: otpCode,
            exp: moment().add(10, "m").valueOf(),
        })

        const update = await prisma.user.update({
            where: { username: username },
            data: {
                verificationToken: token
            }
        })
        if (!update) throw ({ status: 500, message: "Failed to resend OTP" });

        await transporter.sendMail({
            from: 'no-reply <admin@groucery.com>',
            to: user?.email,
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
export default resendOtp