import {z} from "zod";

export enum OfferId {
    PLAN_BASIC = "plan_basic",
    PLAN_STUDENT = "plan_advanced",
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
    id: z.enum([OfferId.PLAN_BASIC, OfferId.PLAN_STUDENT, OfferId.PLAN_COMPANY, OfferId.ONETIME_ONE, OfferId.ONETIME_TWO, OfferId.ONETIME_THREE, OfferId.ONETIME_FOUR])
});

export const getOfferFromSessionInput = z.object({
    session: z.string().min(1, "Session is required.")
});

export const getSessionInput = z.object({
    offerId: z.enum([OfferId.PLAN_BASIC, OfferId.PLAN_STUDENT, OfferId.PLAN_COMPANY, OfferId.ONETIME_ONE, OfferId.ONETIME_TWO, OfferId.ONETIME_THREE, OfferId.ONETIME_FOUR]),
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