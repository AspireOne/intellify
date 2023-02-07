import {Context} from "../context";
import {z} from "zod";
import {generateInput, generateOutput} from "../schemas/generalAi";
import Utils from "../utils";

export async function generateResolver(ctx: Context, input: z.input<typeof generateInput>): Promise<z.output<typeof generateOutput>> {
        const prompt: string = input.prompt;

        console.log("Prompt: " + prompt);
        console.log("Prompt: " + prompt);
        console.log("Prompt: " + prompt);
        console.log("Prompt: " + prompt);
        const output = await Utils.askAi(ctx.openai, {
                model: "text-davinci-003",
                max_tokens: 4000,
                prompt: prompt,
        });

        return {response: output};
}