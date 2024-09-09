import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST as string,
    // port: process.env.EMAIL_PORT as unknown as number,
    host: "127.0.0.1",
    port: 25,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
    tls: { rejectUnauthorized: false }
});

export default transporter