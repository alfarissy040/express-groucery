import type { TCommonError } from "@/types"
import { decodeJWT } from "@/utility"
import prisma from "@/utility/prisma"
import type { Request, Response } from "express"

const verifyEmailRoute = async (req: Request, res: Response) => {
    const token = req.params.token

    try {
        const payload = decodeJWT(token)
        const data = await prisma.user.findFirst({
            where: { username: payload.username }
        })
        if (!data) throw { status: 404, message: "Invalid URL!" }
        if (data.emailVerified) throw { status: 404, message: "Email already verified!" }
        if (data.verificationToken !== token) throw { status: 404, message: "Invalid URL!" }

        const result = await prisma.user.update({
            data: {
                emailVerified: true,
                verificationToken: null
            }, where: { id: data.id }
        })

        return res.json(data)
    } catch (err) {
        console.log(err)
        const error = err as TCommonError;
        return res.status(error.status ?? 500).json({
            status: error.status,
            error: error.errors,
            message: error.message ?? "Somenthing went wrong!",
        });
    }
}

export default verifyEmailRoute