import {z} from "zod";

export const enum Plans { BASIC = "basic", ADVANCED = "advanced", COMPANY = "company" }
export const enum OneTimeOffers { ONE = "one", TWO = "two", THREE = "three", FOUR = "four" }
const oneTimeOfferContent = z.object({
    type: z.enum([OneTimeOffers.ONE, OneTimeOffers.TWO, OneTimeOffers.THREE, OneTimeOffers.FOUR]),
    tokens: z.number(),
    price: z.number(),
});

const planContent = z.object({
    name: z.string(),
    description: z.string(),
    tokens: z.number(),
    price: z.number(),
    type: z.enum([Plans.BASIC, Plans.ADVANCED, Plans.COMPANY])
});

export const getPlanInput = z.object({type: z.enum([Plans.BASIC, Plans.ADVANCED, Plans.COMPANY]),});
export const getPlanOutput = planContent;

export const getPlansInput = z.object({});
export const getPlansOutput = z.object({
    basic: planContent,
    advanced: planContent,
    company: planContent,
});

export const getOneTimeOfferInput = z.object({
    option: z.enum([OneTimeOffers.ONE, OneTimeOffers.TWO, OneTimeOffers.THREE, OneTimeOffers.FOUR])
});
export const getOneTimeOfferOutput = oneTimeOfferContent;

// Empty input. No need to pass anything.
export const getOneTimeOffersOutput = z.object({
    name: z.string(),
    description: z.string(),
    options: z.array(oneTimeOfferContent),
});