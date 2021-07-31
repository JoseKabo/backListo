const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: process.env.HOST_SMTP,
    port: 587,
    auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASS_SMTP,
    }
});

module.exports = transporter;