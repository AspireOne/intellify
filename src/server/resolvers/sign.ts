import {z} from "zod";
import {Context} from "../context";
import {TRPCError} from "@trpc/server";
import {registerInput, registerOutput} from "../schemas/sign";
import User from "../mongodb_models/User";
import {Password} from "../lib/password";
import Email from "../lib/mail";

export async function registerResolver(ctx: Context, input: z.input<typeof registerInput>): Promise<z.output<typeof registerOutput>> {
    await ctx.connectDb();
    const exists = await User.exists({email: input.email}).exec();

    if (exists) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Účet s tímto e-mailem již existuje.",
        });
    }

    const hashedPass = await Password.hashPassword(input.password);
    console.log("-> input.password", input.password);
    console.log("-> hashedPass", hashedPass);

    try {
        await User.create({
            email: input.email,
            password: hashedPass,
            name: (!input.name && !input.surname ? undefined : `${input.name} ${input.surname}`),
            image: "https://intellify.cz/assets/default_avatar.png"});
    } catch (e) {
        console.error(e);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
            message: "Něco se pokazilo.",
        });
    }

    try {
        await Email.sendRegistrationMail(input.email);
    } catch (e) {
        console.error("Could not send registration email", e);
    }

    return {message: 'Uživatel úspěšně registrován.'};
}
