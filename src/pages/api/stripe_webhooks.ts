import {NextApiRequest, NextApiResponse} from "next";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.STRIPE_SK);
const localEndpointSecret = process.env.STRIPE_LOCAL_WEBHOOK_SECRET;
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    if (!sig) res.status(400).send(`Stripe signature doesn't exist!`);

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, localEndpointSecret);
    } catch (err: any) {
        res.status(400).send(`Webhook Error (possibly wrong stripe signature?): ${err?.message}`);
        return;
    }

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