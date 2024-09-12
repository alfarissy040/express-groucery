import type { JwtPayload } from "jsonwebtoken"

declare module "jsonwebtoken" {
    interface JWT extends JwtPayload {
        name: string
        email: string
        username: string
        role: string
        iat: number
        exp: number
    }
    interface OtpJWT extends JwtPayload {
        otp: number
        iat: number
        exp: number
    }
}