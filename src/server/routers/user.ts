import {protectedProcedure, publicProcedure, router} from "../trpc";
import {getUserOutput, updateDataInput, updateDataOutput} from "../schemas/user";
import {getUserResolver, updateDataResolver} from "../resolvers/user";

export const userRouter = router({
    updateData: protectedProcedure
        .input(updateDataInput)
        .output(updateDataOutput)
        .mutation(async ({ctx, input}) => await updateDataResolver(ctx, input)),
    getUser: publicProcedure
        .output(getUserOutput)
        .query(async ({ctx, input}) => await getUserResolver(ctx))
});

// export type definition of API
export type UserRouter = typeof userRouter;