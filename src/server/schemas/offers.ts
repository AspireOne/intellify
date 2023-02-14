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

export const Offer = z.object({
    name: z.string(),
    description: z.string(),
    points: z.array(z.string()),
    tokens: z.number(),
    price: z.number(),
    type: z.enum([OfferType.PLAN, OfferType.ONETIME]),
    id: z.enum([Offers.PLAN_BASIC, Offers.PLAN_ADVANCED, Offers.PLAN_COMPANY, Offers.ONETIME_ONE, Offers.ONETIME_TWO, Offers.ONETIME_THREE, Offers.ONETIME_FOUR])
});

export const getSessionInput = z.object({
    offerId: z.enum([Offers.PLAN_BASIC, Offers.PLAN_ADVANCED, Offers.PLAN_COMPANY, Offers.ONETIME_ONE, Offers.ONETIME_TWO, Offers.ONETIME_THREE, Offers.ONETIME_FOUR]),
    /*token: z.string().min(1, "Token je required."),*/
});

export const getOffersOutput = z.object({
    planBasic: Offer,
    planAdvanced: Offer,
    planCompany: Offer,
    onetimeOne: Offer,
    onetimeTwo: Offer,
    onetimeThree: Offer,
    onetimeFour: Offer,
});