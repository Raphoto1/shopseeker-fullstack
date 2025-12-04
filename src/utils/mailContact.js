//imports de app
import nodemailer from "nodemailer"


const mailHost = process.env.MAILHOST
const mailPort = process.env.MAILPORT
const contactMail = process.env.CONTACT_MAIL
const InfoMail = process.env.INFO_MAIL

//transporter
const transporter = nodemailer.createTransport({
    host: mailHost,
    port: parseInt(mailPort) || 465,
    secure: true,
    auth: {
        user: contactMail,
        pass: process.env.CONTACT_MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
});

//funciones de envio

export async function sendContactMail(name,email,messageToSend) {
    const info = await transporter.sendMail({
        from: contactMail,
        to: InfoMail,
        subject: `${name} is contacting`,
        text: `${name} is contacting with the email ${email}`,
        html: `<div>
        <h1>${name}</h1>
        <h2>${email}</h2>
        <p>${messageToSend}</p>
      </div>`
    });
    return info.messageId;
}

export async function sendResetMailToken(name, uEmail, token) {
    const tokenMail = await transporter.sendMail({
        from:contactMail,
        to: uEmail,
        subject: `${name} your recovery Password Link`,
        text: `${name} please Follow the Link bellow to Reset your Password`,
        html: `<div>
        <h1>this link will work only once</h1>
        <p>${name} please Follow the Link bellow to Reset your Password</p>
        <a>${token}</a>
        </div>`
    });
    const response = await tokenMail
    return response
}

export async function sendDeleteToken(name, uEmail, token) {
    const tokenMail = await transporter.sendMail({
        from:contactMail,
        to: uEmail,
        subject: `${name} Delete Account Link`,
        text: `${name} please Follow the Link bellow to DELETE your Account`,
        html: `<div>
        <h1>this link will work only once</h1>
        <p>${name} please Follow the Link bellow to DELETE your Account</p>
        <a>${token}</a>
        </div>`
    });
    const response = await tokenMail
    return response
}