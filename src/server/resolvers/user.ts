import {Context} from "../context";
import {object, z} from "zod";
import User from "../mongodb_models/User";
import {updateDataInput, updateDataOutput} from "../schemas/user";
import Utils from "../lib/utils";
import {TRPCError} from "@trpc/server";

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