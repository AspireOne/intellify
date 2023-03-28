import {CreateCompletionRequest} from "openai";
import {TRPCError} from "@trpc/server";
import {Context} from "../context";
import User from "../mongodb_models/User";
import {getOffers} from "../resolvers/offers";
import {OfferId} from "../schemas/offers";

export default class Utils {
    public static async getOffer(id: OfferId | string) {
        const offer = Object.values(await getOffers()).find((offer) => offer.id === id);
        if (!offer) throw new Error("Offer id doesn't exist.");
        return offer;
    }

    public static getDefaultSystemMessage = () => `You are Open Tools, a large language model. Answer as concisely as possible. Current date: ${new Date().toLocaleDateString()}.`;

    static async askAi(ctx: Context, config: CreateCompletionRequest): Promise<string> {
        const user = await User.findOne({email: ctx.session?.user?.email}).exec();
        if (!user)
            throw new TRPCError({code: "BAD_REQUEST", message: "Uživatel nenalezen." });

        if ((await user.getTotalTokens()) < (config.prompt?.length || 1))
            throw new TRPCError({code: "BAD_REQUEST", message: "Nedostatek tokenů." });

        let response: string | null;
        let _error = "Chyba při komunikaci s A.I. ";
        let errored = false;

        const addError = (message: string) => {
            errored = true;
            _error += (message + " ");
            console.error(_error);
        }

        try {
            const completion = await ctx.openai.createCompletion({...config, user: ctx.session?.user?.email ?? ""});
            response = completion.data.choices[0].text ?? null;
            if (response && completion.data.usage) {
                await user.decreaseTokensAndSave(Number(completion.data.usage.total_tokens));
            }
            else {
                addError("Nebyla vrácena žádná odpověď nebo se nepodařilo získat využité slova.");
            }
        } catch (e: any) {
            if (e?.response?.status === 400) addError("Požadavek nemohl být splněn kvůli limitaci A.I.");
        }

        if (!errored) return response!.trim();
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: _error
        })

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