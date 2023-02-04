import {Configuration, OpenAIApi} from "openai";
import {z} from "zod";
import {createPresentationInput, createPresentationOutput} from "../schemas/presentation";
import {assistCodeInput, assistCodeOutput} from "../schemas/code";
import {Context} from "../context";
import {TRPCError} from "@trpc/server";
export async function assistCodeResolver(ctx: Context, input: z.input<typeof assistCodeInput>): Promise<z.output<typeof assistCodeOutput>> {
    const prompt: string = generatePrompt(input);
    let output = await askAI(ctx, prompt);
    if (output) {
        output = output.trim();
    } else {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Chyba při komunikaci s AI."
        })
    }

    return {output: output};
}
function generatePrompt(params: z.input<typeof assistCodeInput>): string {
    if (params.type === "command") return params.command + "\n\n" + params.code;
    else {
        return params.code + "\n\n" + "Otázka: " + params.command + "\n\n" + "Odpověď: ";
    }
}
async function askAI(ctx: Context, prompt: string): Promise<string | null> {
    //return "adsadsadmas dmkasmdk asmkd masd mkasdmk asmk dasmk";
    const body = {
        model: "text-davinci-003",
        temperature: 0.38,
        max_tokens: 1800,
        frequency_penalty: 0.05,
        presence_penalty: 0.05,
        prompt: prompt,
    };

    // TODO: Use Curie?
    const completion = await ctx.openai.createCompletion(body);
    return completion.data.choices[0].text ?? null;
}