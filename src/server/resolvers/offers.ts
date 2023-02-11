import {Context} from "../context";
import {z} from "zod";
import {
    getOneTimeOfferInput, getOneTimeOfferOutput,
    getOneTimeOffersOutput,
    getPlanInput,
    getPlanOutput,
    getPlansOutput,
    OneTimeOffers,
    Plans
} from "../schemas/offers";
import {TRPCError} from "@trpc/server";

const planOffers = {
    basic: {
        name: "Základní",
        type: Plans.BASIC,
        description: "Všechno co potřebujete a ještě něco navíc.",
        tokens: 30_000,
        price: 69,
    },
    advanced: {
        name: "Pokročilý",
        type: Plans.ADVANCED,
        description: "Nejlepší možnost pro osobní využití a pro vás další projekt.",
        tokens: 50_000,
        price: 89,
    },
    company: {
        name: "Firma",
        type: Plans.COMPANY,
        description: "Nejlepší možnost pro větší týmy, firmy, a společnosti.",
        tokens: 300_000,
        price: 599
    },
}

const oneTimeOffers = {
    name: "Jednorázové",
    description: "Tokeny můžete koupit taky jednorázově. Žádné opakované platby.",
    options: [
        {
            type: OneTimeOffers.ONE,
            tokens: 10_000,
            price: 39,
        },
        {
            type: OneTimeOffers.TWO,
            tokens: 15_000,
            price: 49
        },
        {
            type: OneTimeOffers.THREE,
            tokens: 20_000,
            price: 69
        },
        {
            type: OneTimeOffers.FOUR,
            tokens: 50_000,
            price: 119,
        }
    ]
}

export async function getPlans(ctx: Context): Promise<z.output<typeof getPlansOutput>> {
    return planOffers;
}
export async function getPlan(ctx: Context, input: z.input<typeof getPlanInput>): Promise<z.output<typeof getPlanOutput>> {
    // Iterate Plans.
    const plan = Object.values(planOffers).find((val) => val.type === input.type);
    if (!plan) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Neexistující plán."
    });
    return plan;
}

export async function getOneTimeOffers(ctx: Context): Promise<z.output<typeof getOneTimeOffersOutput>> {
    return oneTimeOffers;
}
export async function getOneTimeOffer(ctx: Context, input: z.input<typeof getOneTimeOfferInput>)
    : Promise<z.output<typeof getOneTimeOfferOutput>> {

    const option = Object.values(oneTimeOffers.options).find((val) => val.type === input.option);
    if (!option) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Neexistující jednorázová možnost."
    });
    return option;
}