import {protectedProcedure, router} from "../trpc";
import {updateDataInput, updateDataOutput} from "../schemas/user";
import {updateDataResolver} from "../resolvers/user";

export const userRouter = router({
    updateData: protectedProcedure
        .input(updateDataInput)
        .output(updateDataOutput)
        .mutation(async ({ctx, input}) => await updateDataResolver(ctx, input)),
});

// export type definition of API
export type UserRouter = typeof userRouter;