"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (e) {
        console.error("SMTP ERROR CAUGHT: ", e);
    }
}
run();
