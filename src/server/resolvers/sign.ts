import {z} from "zod";
import {Context} from "../context";
import {TRPCError} from "@trpc/server";
import {registerInput, registerOutput} from "../schemas/sign";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";
export async function registerResolver(ctx: Context, input: z.input<typeof registerInput>): Promise<z.output<typeof registerOutput>> {
    const users = (await ctx.db()).collection("users");
    const user = await users.findOne({email: input.email});

    if (user) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Účet s tímto e-mailem již existuje.",
        });
    }

    const hashedPass = await bcrypt.hash(input.password, 10);
    const newUser = await users.insertOne({email: input.email, password: hashedPass});

    if (newUser.acknowledged) return {message: 'Uživatel úspěšně registrován.' };
    else throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Něco se pokazilo.",
    })
}
