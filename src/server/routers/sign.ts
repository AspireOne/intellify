import { z } from 'zod';
import {protectedProcedure, publicProcedure, router} from '../trpc';
import {createPresentationInput, createPresentationOutput} from "../schemas/presentation";
import {createPresentationResolver} from "../resolvers/presentation";
import {registerInput, registerOutput} from "../schemas/sign";
import {registerResolver} from "../resolvers/sign";

export const signRouter = router({
    register: publicProcedure
        .input(registerInput)
        .output(registerOutput)
        .query(async ({ctx, input}) => await registerResolver(ctx, input)),
});

// export type definition of API
export type SignRouter = typeof signRouter;