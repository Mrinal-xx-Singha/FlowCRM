import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
})

export const sendReminderEmail = async(toEmail:string,title:string,notes:string)=>{
    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: toEmail,
        subject: title,
        text: notes
    });
}