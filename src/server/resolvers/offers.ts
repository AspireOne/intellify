import {Context} from "../context";
import {z} from "zod";
import {getOffersOutput, getSessionInput, Offers, OfferType} from "../schemas/offers";
import {Stripe} from "stripe";
import {TRPCError} from "@trpc/server";
import {paths} from "../../lib/constants";

const onetimeName = "Jednorázově";
const onetimeDescription = "Tokeny můžete koupit taky jednorázově. Žádné opakované platby.";
const onetimePoints = [
    'Žádné nastavování nebo skryté poplatky',
    'Přístup do všech projektů',
    "Jednorázová platba",
];

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

    onetimeOne: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: Offers.ONETIME_ONE,
        type: OfferType.ONETIME,
        tokens: 10_000,
        price: 39,
    },

    onetimeTwo: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: Offers.ONETIME_TWO,
        type: OfferType.ONETIME,
        tokens: 15_000,
        price: 49,
    },

    onetimeThree: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: Offers.ONETIME_THREE,
        type: OfferType.ONETIME,
        tokens: 20_000,
        price: 69,
    },

    onetimeFour: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: Offers.ONETIME_FOUR,
        type: OfferType.ONETIME,
        tokens: 50_000,
        price: 119,
    }
}

// TODO: Implement webhooks for refunds etc!
export async function getOffers(): Promise<z.output<typeof getOffersOutput>> {
    return offers;
}

export async function getSession(ctx: Context, input: z.input<typeof getSessionInput>) {
    const stripe = new Stripe(process.env.STRIPE_SK!, {
        apiVersion: '2022-11-15',
    });

    // Find offer with id == input.offerId in offers object.
    const offer = Object.values(offers).find(offer => offer.id === input.offerId);

    if (!offer) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Neexistující nabídka (id)."
        });
    }

    // Create a stripe session.
    return await stripe.checkout.sessions.create({
        mode: offer.type === OfferType.ONETIME ? 'payment' : "subscription",
        submit_type: offer.type === OfferType.ONETIME ? 'pay' : undefined,
        payment_method_types: ['card'],
        currency: 'CZK',
        customer_email: ctx.session?.user?.email ?? undefined,
        locale: 'cs',
        allow_promotion_codes: true,
        automatic_tax: {enabled: true},
        client_reference_id: ctx.session?.user?.email ?? undefined,
        /*discounts: [
            {
                coupon: 'DISCOUNT',
                promotion_code: "promo code"
            },
        ],*/

        /*TODO: Implement tax*/
        line_items: [
            {
                /*price: input.token,*/
                quantity: 1,
                price_data: {
                    currency: 'CZK',
                    unit_amount: offer.price * 100,

                    recurring: offer.type === OfferType.ONETIME ? undefined : {
                        interval: 'month',
                        interval_count: 1,
                    },

                    product_data: {
                        name: "Plán: " + offer.name,
                        description: offer.description,
                        /*TODO: Some cool image of the plan.*/
                    },
                }
            },
        ],
        success_url: `${ctx.req.headers.origin}${paths.orderResult}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}${paths.orderResult}?session_id={CHECKOUT_SESSION_ID}`,
    });


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