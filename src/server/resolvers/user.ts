import {Context} from "../context";
import {object, z} from "zod";
import User from "../mongodb_models/User";
import {getUserOutput, updateDataInput, updateDataOutput} from "../schemas/user";
import Utils from "../lib/utils";
import {TRPCError} from "@trpc/server";
import {Offer} from "../schemas/offers";
import {getOffers} from "./offers";

export async function updateDataResolver(ctx: Context, input: z.input<typeof updateDataInput>): Promise<z.output<typeof updateDataOutput>> {
    await ctx.connectDb();

    const dataToChange = input;

    if (dataToChange.password) {
        dataToChange.password = await Utils.hashPassword(dataToChange.password);
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
    await User.updateOne({email: ctx.session?.user?.email}, dataToChange).exec(function(err: any) {
            if (err) {
                console.error(err);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Něco se pokazilo při aktualizování dat uživatele."
                });
            }
        }
    );

    return {message: "Uživatelská data byla úspěšně aktualizována."}
}

export async function getUserResolver(ctx: Context): Promise<z.output<typeof getUserOutput>> {
    await ctx.connectDb();
    
    const user = await User.findOne({email: ctx.session?.user?.email}).exec();
    if (!user) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Uživatele se nepodařilo získat."});


    return {
        name: user.name,
        image: user.image,
        email: user.email,
        emailVerified: user.emailVerified,
        remainingTokens: user.remainingTokens,
        hasPassword: !!user.password,
        plan: Object.values(await getOffers()).find((offer) => offer.id === user.plan) || null
    }
}