import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
// Avoid exporting the entire t-object since it's not very descriptive.
// For instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<Context>().create();

// Base router and publicProcedure helpers.
// TODO: Implement throttling.
const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Pro tuto akci se musíte přihlásit.',
        });
    }
    return next({ctx});
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);


// potentially middleware