import {createTransport} from "nodemailer";
import {OfferId} from "../schemas/offers";
import Utils from "./utils";
import {Session} from "next-auth";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transport: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_USE_SSL === "true",
    auth: {
        user: process.env.EMAIL_USERNAME!,
        pass: process.env.EMAIL_PASSWORD!,
    },
    from: `Intellify <${process.env.EMAIL_USERNAME}>`,
}
const transporter = createTransport(transport);
export default class Email {
    public static async sendTestMail(email: string) {
        await transporter.sendMail({
            to: email,
            subject: "Testovací email z Intellify",
            text: "Toto je text testovacího mailu z Intellify",
            from: `Intellify <${process.env.EMAIL_USERNAME}>`,
        });
    }

    public static async sendRegistrationMail(mail: string) {
        await transporter.sendMail({
            to: mail,
            from: `Intellify <${process.env.EMAIL_USERNAME}>`,
            subject: "Děkujeme za registraci na Intellify! 🚀",
            text: `Dobrý den,
S velkou radostí Vás vítáme na Intellify, moderní webové platformě nabízející nástroje založené na umělé inteligenci pro každodenní život. Děkujeme Vám za registraci a za to, že jste se připojili k naší komunitě uživatelů, kteří jsou nadšeni z využívání technologií k zjednodušení svého života.

Jsme si vědomi toho, že pokud jde o online platformy, máte spoustu možností. Proto jsme poctěni, že jste si vybrali Intellify. Naše platforma je navržena tak, aby Vám poskytla nejlepší možnou zkušenost, ať už hledáte způsoby, jak zefektivnit pracovní úkoly, organizovat osobní život nebo prostě objevovat nejnovější technologie z oblasti umělé inteligence.

Jako registrovaný uživatel máte nyní přístup ke kompletní sadě našich nástrojů. Vyzýváme Vás, abyste prozkoumali naši platformu a objevili všechny možnosti, které Intellify nabízí.

Pokud máte jakékoliv otázky nebo zpětnou vazbu, neváhejte nás kontaktovat na adrese podpora@intellify.cz. Náš tým je vždy k dispozici, aby Vám pomohl a zajistil, aby Vaše zkušenost s Intellify byla pozitivní.

Ještě jednou Vám děkujeme za připojení k naší komunitě. Těšíme se na to, že Vám pomůžeme dosáhnout Vašich cílů a zjednodušit Váš život pomocí síly umělé inteligence.

S pozdravem,

Tým Intellify 👋
`
        })
    }

    /*public static async sendEmailVerificationMail(to: string, offerId: OfferId) {

    }*/

    public static async sendContactUsMail(session: Session | null, userEmail: string, message: string, phone?: string, subject?: string) {
        await transporter.sendMail({
            to: "info@intellify.cz",
            subject: "Uživatel vás kontaktoval z kontaktního formuláře na Intellify",
            text: `
Zadáno do formuláře: ${userEmail}${phone ? " • " + phone : ""}
Session: ${session ? JSON.stringify(session).trim() : "žádná"}
________________
${subject ? subject + "" : ""}
${message}`,
            from: `Intellify Kontaktní Formulář <${process.env.EMAIL_USERNAME}>`,
        });
    }

/*    public static async sendSubscriptionPaidMail(to: string, orderId: number, invoiceUrl?: string) {
        await transporter.sendMail({
            to: to,
            subject: "Potvrzení platby předplatného",
            text: "Objednávka byla úspěšně zaplacena!"
        });
    }*/
    public static async sendOfferPaidMail(to: string, offerId: OfferId, orderId: number, invoiceUrl?: string) {
        const offer = await Utils.getOffer(offerId);

        await transporter.sendMail({
            to: to,
            subject: "Potvrzení objednávky",
            text: `Objednávka byla úspěšně zaplacena!
            
Číslo objednávky: ${orderId}
Položka: ${offer.fullName}
Cena: ${offer.price} Kč
${invoiceUrl ? "Faktura: " + invoiceUrl : ""}}`,
            html: `
                <h1 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px;">Děkujeme za objednávku!</h1>
<p style="font-size: 16px; color: #666; margin-bottom: 10px;">Objednávka byla úspěšně zaplacena.</p>
<table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; margin-bottom: 20px;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Objednávka:</td>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;">${offer.fullName}</td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Cena:</td>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;">${offer.price} Kč</td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Číslo objednávky:</td>
    <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;">${orderId}</td>
  </tr>
    ${invoiceUrl ? `
    <tr>
        <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #666;">Faktura:</td>
        <td style="width: 50%; padding: 10px; border: 1px solid #ccc; font-size: 16px; color: #333; font-weight: bold;"><a href="${invoiceUrl}">Stáhnout</a></td>
    </tr>
    ` : ""}
</table>
            `,
            from: `Intellify <${process.env.EMAIL_USERNAME}>`,
        });
    }
}