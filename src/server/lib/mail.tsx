import {createTransport} from "nodemailer";
import {z} from "zod";
import {OfferId} from "../schemas/offers";
import Utils from "./utils";
import {Session} from "next-auth";

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
    public static async sendTestMail() {
        await transporter.sendMail({
            to: "matejpesl1@gmail.com",
            subject: "Testovací email z Open Tools",
            text: "Toto je text textovacího mailu z open-tools",
            from: `Open Tools <${process.env.EMAIL_USERNAME}>`,
        });
    }

    public static async sendContactUsMail(session: Session | null, userEmail: string, message: string, phone?: string, subject?: string) {
        await transporter.sendMail({
            to: "matejpesl1@gmail.com",
            subject: "Uživatel vás kontaktoval z kontaktního formuláře na Open Tools",
            text: `
Zadáno do formuláře: ${userEmail}${phone ? " • " + phone : ""}
Session: ${session ? JSON.stringify(session).trim() : "žádná"}
________________
${subject ? subject + "" : ""}
${message}`,
            from: `Open Tools Kontaktní Formulář <${process.env.EMAIL_USERNAME}>`,
        });
    }

    public static async sendOfferPaidMail(to: string, offerId: OfferId) {
        const offer = await Utils.getOffer(offerId);

        await transporter.sendMail({
            to: to,
            subject: "Potvrzení objednávky",
            text: `Objednávka byla úspěšně zaplacena!\\n\\nPoložka: ${offer.name}\nCena: ${offer.price} Kč`,
            html: `
                <h1 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px;">Děkujeme za objednávku</h1>
<p style="font-size: 16px; color: #666; margin-bottom: 10px;">Objednávka byla úspěšně zaplacena.</p>
<table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; margin-bottom: 20px;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Objednávka:</td>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;">${offer.name}</td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Cena:</td>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;">${offer.price} Kč</td>
  </tr>
</table>
            `,
            from: `Open Tools <${process.env.EMAIL_USERNAME}>`,
        });
    }
}