import { z } from 'zod';
import {protectedProcedure, publicProcedure, router} from '../trpc';
import {presentationRouter} from "./presentation";
import {Configuration, OpenAIApi} from "openai";
import {codeRouter} from "./code";
import {signRouter} from "./sign";
import {userRouter} from "./user";
import {generalAiRouter} from "./generalAi";
import {offersRouter} from "./offers";
import 'react-loading-skeleton/dist/skeleton.css';
import {assistCodeInput, assistCodeOutput} from "../schemas/code";
import {assistCodeResolver} from "../resolvers/code";
import Email from "../lib/mail";
export const appRouter = router({
    presentation: presentationRouter,
    code: codeRouter,
    sign: signRouter,
    user: userRouter,
    generalAi: generalAiRouter,
    offers: offersRouter,
    contactUs: protectedProcedure
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





// Inspiration. server/trpc/schema/company.ts Source: https://github.com/ViceVerse-cz/doucovaniweb/blob/master/src/server/trpc/schema/company.ts
/*
import { z } from "zod";

export const createCompanySchema = z.object({
    name: z.string().min(1, { message: "Název je povinný" }),
    prefix: z.string().min(1, { message: "Prefix je povinný" }),
    ico: z.number().min(1, { message: "IČO je povinné" }),
    zip: z.string().min(1, { message: "PSČ je povinné" }),
    city: z.string().min(1, { message: "Město je povinné" }),
    address: z.string().min(1, { message: "Adresa je povinná" }),
    bankNumber: z.string().min(1, { message: "Číslo účtu je povinné" }),
    bankCode: z.string().min(1, { message: "Kód banky je povinný" }),
    allowCardPayment: z.boolean().default(true),
});

export const editCompanySchema = z.object({
    ico: z.number(),
    data: createCompanySchema,
});*/
