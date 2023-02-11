import {protectedProcedure, publicProcedure, router} from "../trpc";
import {
    getOneTimeOfferInput, getOneTimeOfferOutput,
    getOneTimeOffersOutput,
    getPlanInput,
    getPlanOutput,
    getPlansInput,
    getPlansOutput
} from "../schemas/offers";
import {getOneTimeOffers, getOneTimeOffer, getPlan, getPlans} from "../resolvers/offers";

export const offersRouter = router({
    getPlan: publicProcedure
        .input(getPlanInput)
        .output(getPlanOutput)
        .query(async ({ctx, input}) => await getPlan(ctx, input)),

    getPlans: publicProcedure
        .output(getPlansOutput)
        .query(async ({ctx, input}) => await getPlans(ctx)),

    getOneTimeOffer: publicProcedure
        .input(getOneTimeOfferInput)
        .output(getOneTimeOfferOutput)
        .query(async ({ctx, input}) => await getOneTimeOffer(ctx, input)),

    getOneTimeOffers: publicProcedure
        .output(getOneTimeOffersOutput)
        .query(async ({ctx, input}) => await getOneTimeOffers(ctx)),
});

// export type definition of API
export type OffersRouter = typeof offersRouter;