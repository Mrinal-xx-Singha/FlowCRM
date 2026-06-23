"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReminderEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendReminderEmail = async (toEmail, title, notes) => {
    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: toEmail,
        subject: title,
        text: notes
    });
};
exports.sendReminderEmail = sendReminderEmail;
