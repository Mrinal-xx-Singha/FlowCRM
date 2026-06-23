import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function run() {
    try {
        await transporter.verify();
        console.log("SUCCESS: SMTP connected correctly.");
    } catch(e) {
        console.error("SMTP ERROR CAUGHT: ", e);
    }
}
run();
