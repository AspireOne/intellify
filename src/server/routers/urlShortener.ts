import {publicProcedure, router} from '../trpc';
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import ShortenedUrl from "../../server/mongodb_models/ShortenedUrl";

export const urlShortenerRouter = router({
    getUrl: publicProcedure
        .input(z.object({
            slug: z.string().min(1, "Slug musí být přítomný.")}
        ))
        .output(z.string().nullable())
        .query(async ({ctx, input}) => {
            // mongoose.
            const url = await ShortenedUrl.findOne({slug: input.slug});
            return url?.url ?? null;
        }),
    shortenUrl: publicProcedure
        .input(
            z.object({
                url: z.string().url("Nesprávný nebo žádný odkaz."),
                slug: z.string().min(1, "Slug musí být přítomný."),
            })
        )
        .mutation(async ({ctx, input}) => {
            const url = await ShortenedUrl.findOne({slug: input.slug});
            if (url) {
                throw new TRPCError({code: "BAD_REQUEST", message: "Tato cesta už existuje."});
            }

            await ShortenedUrl.create({slug: input.slug, url: input.url});
        })
});

// export type definition of API
export type UrlShortenerRouter = typeof urlShortenerRouter;