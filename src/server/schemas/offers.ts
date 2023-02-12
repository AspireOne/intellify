import {z} from "zod";

export const enum Offers {
    PLAN_BASIC = "plan_basic",
    PLAN_ADVANCED = "plan_advanced",
    PLAN_COMPANY = "plan_company",
    ONETIME_ONE = "onetime_one",
    ONETIME_TWO = "onetime_two",
    ONETIME_THREE = "onetime_three",
    ONETIME_FOUR = "onetime_four",
}

export const enum OfferType { PLAN = "plan", ONETIME = "onetime" }

const OfferMandatory = z.object({
    tokens: z.number(),
    price: z.number(),
    type: z.enum([OfferType.PLAN, OfferType.ONETIME]),
    id: z.enum([Offers.PLAN_BASIC, Offers.PLAN_ADVANCED, Offers.PLAN_COMPANY, Offers.ONETIME_ONE, Offers.ONETIME_TWO, Offers.ONETIME_THREE, Offers.ONETIME_FOUR])
});

export const OfferInfo = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    points: z.array(z.string()).optional(),
});

export const Offer = OfferMandatory.merge(OfferInfo);

export const getOffersOutput = z.object({
    planBasic: Offer,
    planAdvanced: Offer,
    planCompany: Offer,
    onetime: z.object({
        name: z.string(),
        description: z.string(),
        points: z.array(z.string()),
        options: z.array(OfferMandatory),
    }),
});