import nodemailer from "nodemailer"

const mailHost = process.env.MAILHOST
const mailPort = process.env.MAILPORT
const contactMail = process.env.CONTACT_MAIL
const InfoMail = process.env.INFO_MAIL

//transporter
const transporter = nodemailer.createTransport({
    service: "hostinger",
    host:mailHost,
    port: mailPort,
    auth: {
        user: contactMail,
        pass: process.env.CONTACT_MAIL_PASSWORD
    },
    secure: true,
    tls: {
        ciphers:"SSLv3"
    },
    requireTLS: true,
    debug: true,
    connectionTimeout:10000,
});

//funciones de envio

export async function sendContactMail(name,email,messageToSend) {
    const info = await transporter.sendMail({
        to: InfoMail,
        subject: `${name} is contacting`,
        text: `${name} is contacting with the email ${email}`,
        html: `<div>
        <h1>${name}</h1>
        <h2>${email}</h2>
        <p>${messageToSend }</p>
      </div>`
    });
    console.log('mail enviado', info.messageId);
    const response = await info.messageId
    return response
}