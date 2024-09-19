import type { TCommonError } from "@/src/types";
import { decodeJWT } from "@/src/utility";
import prisma from "@/src/utility/prisma";
import type { Request, Response } from "express";
import type { OtpJWT } from "jsonwebtoken";
import { isEqual } from "lodash";

const otpVerify = async (req: Request, res: Response) => {
    const { username, otp } = req.body

    try {
        const user = await prisma.user.findFirst({ where: { username: username }, select: { emailVerified: true, verificationToken: true } })
        if (!user || !user.verificationToken) throw ({ status: 404, message: "User not found" });
        if (user.emailVerified) throw ({ status: 400, message: "Email already verified" });

        const userOtp = decodeJWT(user.verificationToken) as OtpJWT;
        if (!userOtp) throw ({ status: 400, message: "Invalid OTP" });
        if (!isEqual(userOtp.otp, otp)) throw ({ status: 400, message: "Invalid OTP" });
        if (userOtp.exp < Date.now()) throw ({ status: 400, message: "OTP expired" });

        await prisma.user.update({ where: { username: username }, data: { emailVerified: true } })
        return res.json({ status: 200, message: "Email verified" })
    } catch (err) {
        const error = err as TCommonError;
        return res.status(error.status ?? 500).json({
            status: error.status,
            error: error.errors,
            message: error.message ?? "Somenthing went wrong!",
        });
    }
}



export default otpVerify