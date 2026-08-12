//imports de app
import nodemailer from "nodemailer"

// Transporter configuration
const getTransporter = () => {
    const mailHost = process.env.MAILHOST
    const mailPort = process.env.MAILPORT
    const contactMail = process.env.CONTACT_MAIL
    const infoMail = process.env.INFO_MAIL
    const contactPass = process.env.CONTACT_MAIL_PASSWORD

    if (!mailHost || !mailPort || !contactMail || !contactPass) {
        console.error("Missing environment variables for mail configuration");
        return null;
    }

    return nodemailer.createTransport({
        host: mailHost,
        port: parseInt(mailPort) || 465,
        secure: true,
        auth: {
            user: contactMail,
            pass: contactPass
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        }
    });
};

// funciones de envio

export async function sendContactMail(name, email, messageToSend) {
    const transporter = getTransporter();
    if (!transporter) {
        throw new Error("Mail transporter could not be initialized. Check environment variables.");
    }

    const infoMail = process.env.INFO_MAIL;
    const contactMail = process.env.CONTACT_MAIL;

    try {
        const info = await transporter.sendMail({
            from: contactMail,
            to: infoMail,
            subject: `${name} is contacting`,
            text: `${name} is contacting with the email ${email}`,
            html: `<div>
            <h1>${name}</h1>
            <h2>${email}</h2>
            <p>${messageToSend}</p>
          </div>`
        });
        return info.messageId;
    } catch (error) {
        console.error("Error sending mail:", error);
        throw error;
    }
}

export async function sendResetMailToken(name, uEmail, token) {
    const transporter = getTransporter();
    if (!transporter) {
        throw new Error("Mail transporter could not be initialized.");
    }

    const contactMail = process.env.CONTACT_MAIL;

    try {
        const tokenMail = await transporter.sendMail({
            from: contactMail,
            to: uEmail,
            subject: `${name} your recovery Password Link`,
            text: `${name} please Follow the Link bellow to Reset your Password`,
            html: `<div>
            <h1>this link will work only once</h1>
            <p>${name} please Follow the Link bellow to Reset your Password</p>
            <a href="${token}">${token}</a>
            </div>`
        });
        return await tokenMail;
    } catch (error) {
        console.error("Error sending reset mail:", error);
        throw error;
    }
}

export async function sendDeleteToken(name, uEmail, token) {
    const transporter = getTransporter();
    if (!transporter) {
        throw new Error("Mail transporter could not be initialized.");
    }

    const contactMail = process.env.CONTACT_MAIL;

    try {
        const tokenMail = await transporter.sendMail({
            from: contactMail,
            to: uEmail,
            subject: `${name} Delete Account Link`,
            text: `${name} please Follow the Link bellow to DELETE your Account`,
            html: `<div>
            <h1>this link will work only once</h1>
            <p>${name} please Follow the Link bellow to DELETE your Account</p>
            <a href="${token}">${token}</a>
            </div>`
        });
        return await tokenMail;
    } catch (error) {
        console.error("Error sending delete token mail:", error);
        throw error;
    }
}
