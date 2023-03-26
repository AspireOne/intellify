import {z} from "zod";
import {assistCodeInput, assistCodeOutput} from "../schemas/code";
import {Context} from "../context";
import Utils from "../lib/utils";
export async function assistCodeResolver(ctx: Context, input: z.input<typeof assistCodeInput>): Promise<z.output<typeof assistCodeOutput>> {
    await ctx.connectDb();

    const prompt: string = generatePrompt(input);
    const output = await Utils.askAi(ctx, {
        model: "text-davinci-003",
        frequency_penalty: 0.05,
        presence_penalty: 0.05,
        temperature: 0.38,
        max_tokens: 4000,
        prompt: prompt,
    });

    return {output: output};
}
function generatePrompt(params: z.input<typeof assistCodeInput>): string {
    if (params.type === "command") return params.command + "\n\n" + params.code;
    else {
        return params.code + "\n\n" + "Otázka: " + params.command + "\n\n" + "Odpověď: ";
    }
}