import {NextApiRequest, NextApiResponse} from "next";
import Stripe from "stripe";
import {buffer} from "micro";
import StripeSession from "../../server/mongodb_models/StripeSession";
import Utils from "../../server/lib/utils";
import {OfferType} from "../../server/schemas/offers";
import User from "../../server/mongodb_models/User";

const stripe = require('stripe')(process.env.STRIPE_SK);
const localEndpointSecret = process.env.STRIPE_LOCAL_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};
// TODO: Implement webhooks for refunds etc!
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    if (!sig) return res.status(400).send(`Stripe signature doesn't exist!`);

    try {
        event = stripe.webhooks.constructEvent(buf, sig, localEndpointSecret);
    } catch (err: any) {
        res.status(400).send(`Webhook Error (possibly wrong Stripe signature?): ${err?.message}`);
        return;
    }

    //return res.status(200).send("Webhook received!");

    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutSessionCompletedEvent(event);
            return res.status(200).send("Webhook received and sucessfully processed!");
            break;
        case "":
    }
    return;

    if (event.type === 'checkout.session.completed') {
        console.log("Checkout session completed!");
    } else if (event.type === 'payment_intent.succeeded') {
        console.log("Payment intent succeeded!");
    } else if (event.type === 'payment_intent.payment_failed') {
        console.log("Payment intent failed!");
    } else if (event.type === "charge.succeeded") {
        console.log("Charge succeeded!");
    } else if (event.type === "charge.failed") {
        console.log("charge failed!");
    } else if ("customer.subscription.created") {
        console.log("Subscription created!");
    } else if ("customer.subscription.updated") {
        console.log("Subscription updated!");
    } else if ("customer.subscription.deleted") {
        console.log("Subscription deleted!");
    } else if ("customer.updated") {
        console.log("Customer updated!");
    }
    res.status(200).send("Webhook received!");
}

/**
 * Handles the checkout.session.completed event. Occurs when a checkout session is completed - be it subscription
 * or one-time payment.
* */
async function handleCheckoutSessionCompletedEvent(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    // Get the session.
    const stripeSession = await StripeSession.findOne({sessionId: session.id});
    if (!stripeSession) throw new Error("According stripe session for the session provided doesn't exist in db.");

    // Get the according user.
    const user = await User.findById(stripeSession.userId);
    if (!user) throw new Error("According user for the provided stripe session was not found in db or failed to populate.");

    // Get the according offer.
    const offer = await Utils.getOffer(stripeSession.offerId);

    // Add the tokens / subscription to the user.
    if (offer.type == OfferType.ONETIME) {
        user.addFreeTokensAndSave(offer.tokens);
    } else if (offer.type == OfferType.PLAN) {
        user.setSubscriptionAndSave(offer.id);
    }
}

function handleSubscriptionDeletedEvent(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    // get the session form db.
    const stripeSession = StripeSession.findOne({sessionId: session.id});

    console.log("Checkout session completed!");
}