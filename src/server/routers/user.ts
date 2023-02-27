import {protectedProcedure, router} from "../trpc";
import {updateDataInput, updateDataOutput} from "../schemas/user";
import {getUserResolver, updateDataResolver} from "../resolvers/user";

export const userRouter = router({
    updateData: protectedProcedure
        .input(updateDataInput)
        .output(updateDataOutput)
        .mutation(async ({ctx, input}) => await updateDataResolver(ctx, input)),
    getUser: protectedProcedure
        .query(async ({ctx, input}) => await getUserResolver(ctx))
});

// export type definition of API
export type UserRouter = typeof userRouter;