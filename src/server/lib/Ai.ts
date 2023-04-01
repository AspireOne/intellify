import {ChatCompletionRequestMessage, CreateChatCompletionRequest, CreateCompletionRequest} from "openai";
import {TRPCError} from "@trpc/server";
import {Context} from "../context";
import User from "../mongodb_models/User";

export class Ai {
    static getDefaultMessages(): ChatCompletionRequestMessage[] {
        return [
            {role: "system", content: `Jsi nápomocný asistent GPT-4. Dnešní datum: ${new Date().toLocaleDateString("cs-CZ")}`},
        ]
    }

    static async ask(ctx: Context, config: CreateChatCompletionRequest): Promise<string> {
        // Get user.
        const user = await User.findById(ctx.session?.user?.id);
        if (!user)
            throw new TRPCError({code: "BAD_REQUEST", message: "Uživatel nenalezen." });

// get the total number of words in config.messages array.
        const amountOfInputWords = config.messages?.reduce((acc, cur) => acc + cur.content.split(" ").length, 0) ?? 1;
        const amountOfInputTokens = amountOfInputWords * 0.75;

// Check if user has enough tokens.
        if ((await user.getTotalTokens()) < amountOfInputTokens)
            throw new TRPCError({code: "BAD_REQUEST", message: "Nedostatek slov." });


        let response: string | null;
        let _error = "Chyba při komunikaci s A.I. ";
        let errored = false;

        const addError = (message: string) => {
            errored = true;
            _error += (message + " ");
            console.error(_error);
        }

// Execute the request.
        try {
            // Execute the request.
            const completion = await ctx.openai.createChatCompletion({
                ...config,
                user: ctx.session?.user?.email ?? ""
            });

            // To implement streaming, look here: https://github.com/openai/openai-node/issues/18
            // Parse the response.
            response = completion.data.choices[0].message?.content ?? null;
            if (response) {
                if (!completion.data.usage) console.error("OpenAI did not return token usage!");
                await user.decreaseTokensAndSave(Number(completion.data.usage?.total_tokens) ?? 200);
            }
            else {
                addError("Z OpenAI serveru nebyla vrácena žádná odpověď.");
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