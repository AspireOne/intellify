import {Context} from "../context";
import {z} from "zod";
import {generateInput, generateOutput} from "../schemas/generalAi";
import Utils from "../lib/utils";

export async function generateResolver(ctx: Context, input: z.input<typeof generateInput>): Promise<z.output<typeof generateOutput>> {
        const output = await Utils.askAi(ctx, {
                model: "text-davinci-003",
                max_tokens: 2000,
                temperature: input.temperature,
                presence_penalty: 0.2,
                frequency_penalty: 0.2,
                prompt: input.prompt,
        });

        return {response: output};
}