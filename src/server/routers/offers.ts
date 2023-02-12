import {publicProcedure, router} from "../trpc";
import {getOffersOutput} from "../schemas/offers";
import {getOffers} from "../resolvers/offers";

export const offersRouter = router({
    getOffers: publicProcedure
        .output(getOffersOutput)
        .query(getOffers),
});

// export type definition of API
export type OffersRouter = typeof offersRouter;