import {Context} from "../context";
import {z} from "zod";
import User from "../mongodb_models/User";
import {getUserOutput, updateDataInput, updateDataOutput} from "../schemas/user";
import Utils from "../lib/utils";
import {TRPCError} from "@trpc/server";
import {Password} from "../lib/password";

export async function updateDataResolver(ctx: Context, input: z.input<typeof updateDataInput>): Promise<z.output<typeof updateDataOutput>> {
    await ctx.connectDb();

    const dataToChange = input;

    if (dataToChange.password) {
        dataToChange.password = await Password.hashPassword(dataToChange.password);
    }
    // Iterate over the input and remove all fields that are undefined.
    for (const key in dataToChange) {
        // @ts-ignore
        if (dataToChange[key] === undefined || dataToChange[key] === null) {
            // @ts-ignore
            delete dataToChange[key];
        }
    }

    // Update the user data in db.
    try {
        await User.updateOne({email: ctx.session?.user?.email}, dataToChange);
    } catch (e) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Něco se pokazilo při aktualizování dat uživatele."
        });
    }

    return {message: "Uživatelská data byla úspěšně aktualizována."}
}

export async function getUserResolver(ctx: Context): Promise<z.output<typeof getUserOutput>> {
    await ctx.connectDb();

    if (!ctx.session?.user?.id) {
        console.log("getUser requested | id does not exist in session");
        return null;
    }
    /*console.log("user id: " + ctx.session?.user?.id);*/

    const user = await User.findById(ctx.session?.user?.id);
    if (!user) {
        console.log("getUser requested | id is on session, but user does not exist in db (based on the id)");
        return null;
    }

    /*console.log("GETUSER | USER: ", user);*/

    let subscriptionData;
    if (user.subscription) {
        const offer = await Utils.getOffer(user.subscription.id);
        subscriptionData = {...user.subscription, remainingTokens: user.remainingSubscriptionTokens ?? 0, data: offer};
    }

    return {
        name: user.name,
        image: user.image,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        remainingFreeTokens: user.remainingFreeTokens,
        subscription: subscriptionData,
        hasPassword: !!user.password,
    }
}