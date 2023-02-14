import {createTransport} from "nodemailer";

const transporter = createTransport({
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_USE_SSL === "true",
    auth: {
        user: process.env.EMAIL_USERNAME!,
        pass: process.env.EMAIL_PASSWORD!,
    },
    from: "Open Tools <matejpesl1@seznam.cz>",
});
export default class Email {
    // TODO: Define each email here, not inline in code.
    public static sendTestMail() {
        // Use nodemailer and env variables to send an email.

        // send the mail using the transporter.
        transporter.sendMail({
            to: "matejpesl1@gmail.com",
            subject: "Testovací email z Open Tools",
            text: "Toto je text textovacího mailu z open-tools",
            from: `Open Tools <${process.env.EMAIL_USERNAME}>`,
        })
            .then((info) => {
                console.log("sent mail: " + info);
            })
            .catch((err) => {
                console.log("error sending mail: " + err);
            });
    }
}