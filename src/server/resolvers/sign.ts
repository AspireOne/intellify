import {z} from "zod";
import {Context} from "../context";
import {TRPCError} from "@trpc/server";
import {registerInput, registerOutput} from "../schemas/sign";
import bcrypt from "bcrypt";
import User from "../mongodb_models/User";
import Utils from "../lib/utils";

export async function registerResolver(ctx: Context, input: z.input<typeof registerInput>): Promise<z.output<typeof registerOutput>> {
    await ctx.connectDb();
    const exists = await User.exists({email: input.email}).exec();

    if (exists) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Účet s tímto e-mailem již existuje.",
        });
    }

    const hashedPass = await Utils.hashPassword(input.password);

    await User.create({email: input.email, password: hashedPass, image: "https://user-images.githubusercontent.com/57546404/216829624-4e906eea-77da-48dd-983a-12c627685061.png"}, function(err) {
        if (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Něco se pokazilo.",
            });
        }
    });
    return {message: 'Uživatel úspěšně registrován.' };
}
