import {NextApiRequest, NextApiResponse} from "next";
import Stripe from "stripe";
import {buffer} from "micro";
import StripeSession from "../../server/mongodb_models/StripeSession";
import Utils from "../../server/lib/utils";
import {OfferId, OfferType} from "../../server/schemas/offers";
import User from "../../server/mongodb_models/User";
import Email from "../../server/lib/mail";

const stripe = require('stripe')(process.env.STRIPE_SK);

// Because stripe needs raw body.
export const config = {
    api: {
        bodyParser: false,
    },
};

// TODO: Implement webhooks for refunds etc!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const buff = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    if (!sig) return res.status(400).send(`Stripe signature doesn't exist!`);

    try {
        event = stripe.webhooks.constructEvent(buff, sig, process.env.STRIPE_LOCAL_WEBHOOK_SECRET);
    } catch (err: any) {
        res.status(400).send(`Webhook Error (possibly wrong Stripe signature?): ${err?.message}`);
        return;
    }

    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutSessionCompletedEvent(event);
            return res.status(200).send("Webhook received | checkout.session.completed successfuly handled.");
            break;
        case "invoice.created":

            await handleInvoiceCreatedEvent(event);
            return res.status(200).send("Webhook received | invoice.created successfuly handled.");
        default:
            return res.status(200).send("Webhook received | ignored.");
    }
}

/**
 * Handles the checkout.session.completed event. Occurs when a checkout session is completed - be it subscription
 * or one-time payment.
 *
 * Adds the specified tokens or subscription to the user.
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
        await user.addFreeTokensAndSave(offer.tokens);
    } else if (offer.type == OfferType.PLAN) {
        await user.setSubscriptionAndSave(offer.id, session.subscription as string);
    }

    await Email.sendOfferPaidMail(user.email, stripeSession.offerId as OfferId);
}

async function handleInvoiceCreatedEvent(event: Stripe.Event) {
    console.log("Attention! Handling session invoice created event! Recurring subscription cycle?");
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.billing_reason !== "subscription_cycle") {
        console.log("The billing reason was not subscription_cycle, returning!");
        return;
    }
    console.log("-> The billing reason was subscription_cycle...");

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);

    console.log("-> Sucessfully retrieved subscription and customer from stripe...");

    const currentDate = new Date();
    const currentBillingPeriodEnd = new Date(subscription.current_period_end * 1000);

    // checks for the subscription status and the current billing period end because it needs to make sure that
    // the invoice event is related to an active subscription and that the invoice was generated
    // at the end of a billing cycle.
    if (subscription.status !== "active" || currentBillingPeriodEnd.getTime() !== currentDate.getTime()) {
        console.log("Subscription status was not active or current billing period was not the same as current date! Returning.");
        return;
    }

    const nextInvoice = await stripe.invoices.create({
        customer: customer.id,
        subscription: subscription.id,
        auto_advance: true,
    });

    console.log("-> Invoice created...");

    // Send the invoice to the customer via email.
    await stripe.invoices.sendInvoice(nextInvoice.id);
    console.log("-> Invoice sent...");

    // Update User.subscription.updatedAt.
    const updated = await User.findOneAndUpdate({"subscription.stripeId": subscription.id},
        {$set: {"subscription.updatedAt": currentDate}}, {new: true});
    if (!updated) throw new Error("Failed to update the subscription's updatedAt date in the db.");
    console.log("-> Everything completed. Updated user:");
    console.log(updated);
}