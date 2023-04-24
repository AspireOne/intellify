import { z } from 'zod';
import {publicProcedure, router} from '../trpc';
import {presentationRouter} from "./presentation";
import {codeRouter} from "./code";
import {signRouter} from "./sign";
import {userRouter} from "./user";
import {generalAiRouter} from "./generalAi";
import {offersRouter} from "./offers";
import 'react-loading-skeleton/dist/skeleton.css';
import Email from "../lib/mail";
import {emailRouter} from "./email";
import {urlShortenerRouter} from "./urlShortener";

export const appRouter = router({
    presentation: presentationRouter,
    code: codeRouter,
    sign: signRouter,
    user: userRouter,
    generalAi: generalAiRouter,
    offers: offersRouter,
    emailRouter: emailRouter,
    urlShortener: urlShortenerRouter,
    /*sendTestMail: publicProcedure
        .mutation(async ({ctx}) => {
            await Email.sendTestMail("matejpesl1@gmail.com");
        }),*/
    ping: publicProcedure
        .input(z.object({
            message: z.string(),
        }))
        .output(z.object({
            message: z.string(),
        }))
        .query(async ({ctx, input}) => {
            console.log("-> RECEIVED: input.message", input.message);
            return {message: input.message};
        }),
    contactUs: publicProcedure
        .input(z.object({
            email: z.string().min(1, {message: "Email je povinný."}).email({message: "Email není ve správném formátu."}),
            phone: z.string().optional(),
            subject: z.string().optional(),
            message: z.string().min(6, {message: "Zpráva je povinná."}),
        }))
        .mutation(async ({ctx, input}) => {
            await Email.sendContactUsMail(ctx.session, input.email, input.message, input.phone, input.subject);
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;