import {protectedProcedure, publicProcedure, router} from "../trpc";
import {getOfferFromSessionInput, getOffersOutput, getSessionInput} from "../schemas/offers";
import {getOfferFromSession, getOffers, getSession} from "../resolvers/offers";
import { z } from "zod";

export const offersRouter = router({
    getOffers: publicProcedure
        .output(getOffersOutput)
        .query(getOffers),

    getSession: protectedProcedure
        .input(getSessionInput)
        .mutation(({ctx, input}) => getSession(ctx, input)),

    getOfferFromSession: protectedProcedure
        .input(getOfferFromSessionInput)
        .mutation(({ctx, input}) => getOfferFromSession(ctx, input)),
});

// export type definition of API
export type OffersRouter = typeof offersRouter;