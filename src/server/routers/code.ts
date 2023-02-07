import {protectedProcedure, router} from '../trpc';
import {assistCodeInput, assistCodeOutput} from "../schemas/code";
import {assistCodeResolver} from "../resolvers/code";
export const codeRouter = router({
    assistCode: protectedProcedure
        .input(assistCodeInput)
        .output(assistCodeOutput)
        .mutation(async ({ctx, input}) => await assistCodeResolver(ctx, input)),
});

// export type definition of API
export type CodeRouter = typeof codeRouter;