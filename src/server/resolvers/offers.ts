import {Context} from "../context";
import {z} from "zod";
import {getOffersOutput, getSessionInput, OfferId, OfferType, Offer, getOfferFromSessionInput} from "../schemas/offers";
import {Stripe} from "stripe";
import {TRPCError} from "@trpc/server";
import {paths} from "../../lib/constants";
import StripeSession from "../mongodb_models/StripeSession";
import User from "../mongodb_models/User";
import Utils from "../lib/utils";

const onetimeName = "Jednorázově";
const onetimeDescription = "Slova můžete koupit taky jednorázově. Žádné opakované platby.";
const onetimePoints = [
    'Žádné nastavování nebo skryté poplatky',
    'Přístup do všech projektů',
    "Jednorázová platba",
];

// TODO: ADD THE SPECIFIC MODULES THAT WILL BE OPEN TO THEM.
export const offers = {
    planBasic: {
        name: "Základní",
        id: OfferId.PLAN_BASIC,
        type: OfferType.PLAN,
        description: "Všechno co potřebujete a ještě něco navíc.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do základních nástrojů',
            '24/7 Podpora',
        ],
        tokens: 30_000,
        price: 69,
    },
    planAdvanced: {
        name: "Student",
        id: OfferId.PLAN_STUDENT,
        type: OfferType.PLAN,
        description: "Nejlepší možnost pro studenty a pro osobní využití.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do základních + pokročilých nástrojů',
            '24/7 Podpora',
        ],
        tokens: 50_000,
        price: 89,
    },
    planCompany: {
        name: "Firma",
        id: OfferId.PLAN_COMPANY,
        type: OfferType.PLAN,
        description: "Nejlepší možnost pro větší týmy, firmy, a společnosti.",
        points: [
            'Žádné nastavování nebo skryté poplatky',
            'Přístup do všech dostupných nástrojů, včetně těch pro firemní potřeby',
            '24/7 Podpora',
        ],
        tokens: 300_000,
        price: 599
    },

    onetimeOne: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: OfferId.ONETIME_ONE,
        type: OfferType.ONETIME,
        tokens: 10_000,
        price: 39,
    },

    onetimeTwo: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: OfferId.ONETIME_TWO,
        type: OfferType.ONETIME,
        tokens: 15_000,
        price: 49,
    },

    onetimeThree: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: OfferId.ONETIME_THREE,
        type: OfferType.ONETIME,
        tokens: 20_000,
        price: 69,
    },

    onetimeFour: {
        name: onetimeName,
        description: onetimeDescription,
        points: onetimePoints,
        id: OfferId.ONETIME_FOUR,
        type: OfferType.ONETIME,
        tokens: 50_000,
        price: 119,
    }
}

export async function getOffers(): Promise<z.output<typeof getOffersOutput>> {
    return offers;
}

export async function getOfferFromSession(ctx: Context, input: z.input<typeof getOfferFromSessionInput>) {
    const session = await StripeSession.findOne({sessionId: input.session});
    if (!session) throw new TRPCError({code: "BAD_REQUEST", message: "Platba nebyla nalezena."});
    return await Utils.getOffer(session.offerId);
}

export async function getSession(ctx: Context, input: z.input<typeof getSessionInput>) {
    if (!ctx.session?.user?.id) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Nepodařilo se získat ID uživatele."
    });

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

    let session: Stripe.Checkout.Session;

    try {
        session = await createSession(ctx, offer, stripe);
    } catch (e) {
        console.log(e);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Chyba při vytváření platby."
        });
    }

    /*await ctx.connectDb();*/
    try {
        await StripeSession.create({sessionId: session.id, userId: ctx.session.user.id, offerId: offer.id});
    } catch (e) {
        console.log(e);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Něco se pokazilo při ukládání platební session.",
        });
    }

    return session;
}

async function createSession(ctx: Context, offer: z.infer<typeof Offer>, stripe: Stripe) {
    return await stripe.checkout.sessions.create({
        mode: offer.type === OfferType.ONETIME ? 'payment' : "subscription",
        submit_type: offer.type === OfferType.ONETIME ? 'pay' : undefined,
        payment_method_types: ['card'],
        currency: 'CZK',
        customer_email: ctx.session?.user?.email ?? undefined,
        locale: 'cs',
        allow_promotion_codes: true,
        automatic_tax: {enabled: true},
        client_reference_id: ctx.session?.user?.id ?? undefined,
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
                    unit_amount: offer.price * 100, // 1 = cent.

                    recurring: offer.type === OfferType.ONETIME ? undefined : {
                        interval: 'month',
                        interval_count: 1,
                    },

                    product_data: {
                        name: offer.type === OfferType.ONETIME ? offer.name : ("Předplatné: " + offer.name),
                        description: offer.description,
                        metadata: {
                            offerId: offer.id,
                        },
                        /*TODO: Some cool image of the subscriptionType.*/
                    },
                }
            },
        ],
        success_url: `${ctx.req.headers.origin}${paths.orderResult}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}${paths.orderResult}?session_id={CHECKOUT_SESSION_ID}`,
    });
}