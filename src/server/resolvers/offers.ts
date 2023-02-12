import {Context} from "../context";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {getOffersOutput, Offers, OfferType} from "../schemas/offers";

const offers = {
    planBasic: {
        name: "Základní",
        id: Offers.PLAN_BASIC,
        type: OfferType.PLAN,
        description: "Všechno co potřebujete a ještě něco navíc.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do všech projektů',
            '24/7 Podpora',
        ],
        tokens: 30_000,
        price: 69,
    },
    planAdvanced: {
        name: "Pokročilý",
        id: Offers.PLAN_ADVANCED,
        type: OfferType.PLAN,
        description: "Nejlepší možnost pro osobní využití a pro vás další projekt.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do všech projektů',
            '24/7 Podpora',
        ],
        tokens: 50_000,
        price: 89,
    },
    planCompany: {
        name: "Firma",
        id: Offers.PLAN_COMPANY,
        type: OfferType.PLAN,
        description: "Nejlepší možnost pro větší týmy, firmy, a společnosti.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            "Velikost týmu: 10+ vývojářů",
            /*'Přístup do všech projektů',*/
            '24/7 Podpora',
        ],
        tokens: 300_000,
        price: 599
    },
    onetime: {
        name: "Jednorázové",
        description: "Tokeny můžete koupit taky jednorázově. Žádné opakované platby.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do všech projektů',
            "Jednorázová platba"
        ],
        options: [
            {
                id: Offers.ONETIME_ONE,
                type: OfferType.ONETIME,
                tokens: 10_000,
                price: 39,
            },
            {
                id: Offers.ONETIME_TWO,
                type: OfferType.ONETIME,
                tokens: 15_000,
                price: 49
            },
            {
                id: Offers.ONETIME_THREE,
                type: OfferType.ONETIME,
                tokens: 20_000,
                price: 69
            },
            {
                id: Offers.ONETIME_FOUR,
                type: OfferType.ONETIME,
                tokens: 50_000,
                price: 119,
            }
        ]
    }
}

export async function getOffers(): Promise<z.output<typeof getOffersOutput>> {
    return offers;
}
/*export async function getPlan(ctx: Context, input: z.input<typeof getPlanInput>): Promise<z.output<typeof getPlanOutput>> {
    // Iterate Plans.
    const plan = Object.values(planOffers).find((val) => val.type === input.type);
    if (!plan) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Neexistující plán."
    });
    return plan;
}*/