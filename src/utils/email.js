const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASS,
    },
});

exports.sendEmail = async (params) => {
    let info = await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
    });
    return true;
};
