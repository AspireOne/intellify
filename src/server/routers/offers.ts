import {protectedProcedure, publicProcedure, router} from "../trpc";
import {getOfferFromSessionInput, getOffersOutput, getSessionInput} from "../schemas/offers";
import {getOfferFromSession, getOffers, getSession} from "../resolvers/offers";
import User from "../mongodb_models/User";
import {TRPCError} from "@trpc/server";

export const offersRouter = router({
    getOffers: publicProcedure
        .output(getOffersOutput)
        .query(getOffers),

    getSession: protectedProcedure
        .input(getSessionInput)
        .mutation(({ctx, input}) => getSession(ctx, input)),

    getOfferFromSession: publicProcedure
        .input(getOfferFromSessionInput)
        .mutation(({ctx, input}) => getOfferFromSession(ctx, input)),

    cancelSubscription: protectedProcedure
        .mutation(async ({ctx}) => {
            const stripe = require('stripe')(process.env.STRIPE_SK);
            if (!ctx.session) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Session bylo null."
            });

            const user = await User.findById(ctx.session.user.id);
            if (!user) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Uživatel nebyl nalezen."
            });

            const subId = user.subscription?.stripeId;
            if (!subId) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Předplatné uživatele nenalezeno."
            });

            stripe.subscriptions.update(subId, {cancel_at_period_end: true});
        }),
});

// export type definition of API
export type OffersRouter = typeof offersRouter;