const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: "smtp.hostinger.mx",
    port: 587,
    auth: {
        user: "cdental.support@tecdevsmx.com",
        pass: ">fmd;s&9lO",
    }
});

module.exports = transporter;