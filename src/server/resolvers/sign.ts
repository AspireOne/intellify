import {z} from "zod";
import {Context} from "../context";
import {TRPCError} from "@trpc/server";
import {registerInput, registerOutput} from "../schemas/sign";
import bcrypt from "bcrypt";
import User from "../models/User";

export async function registerResolver(ctx: Context, input: z.input<typeof registerInput>): Promise<z.output<typeof registerOutput>> {
    await ctx.connectDb();

    const exists = await User.exists({email: input.email}).exec();

    if (exists) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Účet s tímto e-mailem již existuje.",
        });
    }

    const hashedPass = await bcrypt.hash(input.password, 10);

    await User.create({email: input.email, password: hashedPass}, function(err) {
        if (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Něco se pokazilo.",
            });
        }
    });
    return {message: 'Uživatel úspěšně registrován.' };
}
