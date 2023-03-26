import {publicProcedure, router} from '../trpc';
import {registerInput, registerOutput} from "../schemas/sign";
import {registerResolver} from "../resolvers/sign";

export const signRouter = router({
    register: publicProcedure
        .input(registerInput)
        .output(registerOutput)
        .mutation(async ({ctx, input}) => await registerResolver(ctx, input)),
});

// export type definition of API
export type SignRouter = typeof signRouter;