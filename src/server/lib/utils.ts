import bcrypt from "bcrypt";
import {CreateCompletionRequest, OpenAIApi} from "openai";
import {TRPCError} from "@trpc/server";
import {Context} from "../context";
import {createTransport} from "nodemailer";

export default class Utils {
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    static async askAi(ctx: Context, config: CreateCompletionRequest): Promise<string> {
        // TODO: Use Curie?
        let response: string | null;
        try {
            const completion = await ctx.openai.createCompletion({...config, user: ctx.session?.user?.email ?? ""});
            response = completion.data.choices[0].text ?? null;
            if (response === null) throw new Error();
        } catch (e) {
            console.log(e);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Chyba při komunikaci s AI."
            })
        }

        return response.trim();

        /*const req = https.request({
            hostname:"api.openai.com",
            port:443,
            path:"/v1/completions",
            method:"POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ process.env.OPENAI_API_KEY
            }
        }, function(res) {
            res.on('data', (chunk) => {
                console.log("BODY: " + chunk);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error("problem with request:" + e.message);
        });
        req.write(body)
        req.end()

        return null;*/
    }
}