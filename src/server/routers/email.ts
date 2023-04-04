import {protectedProcedure, router} from '../trpc';
import {z} from "zod";
import {Ai} from "../lib/Ai";
import {TRPCError} from "@trpc/server";
import {Context} from "../context";
import {ChatCompletionRequestMessage} from "openai";

const systemMessage = "Jsi asistent, který píše za lidi podle instrukcí obsah e-mailu. Dnešní datum: " + new Date().toLocaleDateString("cs-CZ");


const generateEmailObject = z.object({
    tone: z.string().min(1, {message: "Tón je prázdný."}).optional(),
    goal: z.string().min(1, {message: "Cíl je povinný."}),
    information: z.string().min(1, {message: "Dodatečné informace jsou prázdné."}).optional(),
    pov: z.string().min(1, {message: "Pohled je prázdný."}).optional(),
});

export type GenerateEmail = z.infer<typeof generateEmailObject>;

// TODO: Save chat in db. Retrieve by id.
export const emailRouter = router({
    generateEmail: protectedProcedure
        .input(generateEmailObject)
        .output(z.object({
            subject: z.string(),
            content: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            const messages = Ai.addMessage("system", systemMessage, []);

            Ai.addMessage(
                "user",
                getGenerationPrompt({tone: input.tone || "neutrální", goal: input.goal, information: input.information, pov: input.pov}),
                messages);

            console.log("prompt: ", getGenerationPrompt({tone: input.tone || "neutrální", goal: input.goal, information: input.information, pov: input.pov}));

            const output = await askAi(ctx, messages);
            console.log("output raw: " + output);
            return parseResponse(output);
        }),

    editEmail: protectedProcedure
        .input(z.object({
            subject: z.string().min(1, {message: "Předmět je prázdný."}),
            content: z.string().min(1, {message: "Obsah je prázdný."}),
            instruction: z.string().min(1, {message: "Instrukce jsou prázdné."}),
        }))
        .output(z.object({
            subject: z.string(),
            content: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            // TODO: Use previous chat retrieved from db.
            const messages = Ai.addMessage("system", systemMessage, []);
            Ai.addMessage("user", getEditPrompt(input), messages);

            const output = await askAi(ctx, messages);
            return parseResponse(output);

        })
});

function parseResponse(response: string): {subject: string, content: string} {
    response = fixJsonNewlines(response);
    console.log("edited response:" + response);

    const outputObj = JSON.parse(response);

    if (!outputObj.subject || !outputObj.content) {
        console.error("Invalid output: ", outputObj);
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Nepodařilo se zpracovat odpověď A.I. Zkuste to prosím později."})
    }

    return outputObj;
}

function fixJsonNewlines(input: string): string {
    let output = '';
    let inString = false;

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        if (char === '"' && input.charAt(i - 1) !== '\\') {
            inString = !inString;
        }

        if (inString && char === '\n') {
            output += '\\n';
        } else {
            output += char;
        }
    }

    return output;
}

async function askAi(ctx: Context, messages: ChatCompletionRequestMessage[]): Promise<string> {
    return await Ai.ask(ctx, {
        model: "gpt-3.5-turbo",
        max_tokens: 3000,
        presence_penalty: 0.2,
        frequency_penalty: 0.2,
        messages: messages,
    });
}

function getEditPrompt(props: {subject: string, content: string, instruction: string}) {
    return `
    Předmět: ${props.subject}
    Obsah: ${props.content}
    
    Uprav e-mail podle následujících instrukcí: ${props.instruction}.
    
    Výstup musíš napsat ve formátu JSON, následovně:
    {
        "subject": "[předmět]",
        "content": "[obsah]"
    }
    `
}
function getGenerationPrompt(props: {tone: string, goal: string, information?: string, pov?: string}): string {

    return `${props.pov ? "Jsem " + format(props.pov) + ". " : ""}Napiš za mě e-mail, který má za cíl ${format(props.goal)}.${props.information ? " " + format(props.information) + "." : ""}`
        + "\n\n"
        + `Použij ${props.tone} tón. Výstup musíš napsat ve formátu JSON, následovně:`
        + `\n`
        + "{\n\"subject\": [předmět],\n\"content\": [obsah]\n}"
}

function format(text: string) {
    // remove dot at the end of string
    if (text.endsWith(".")) {
        text = text.slice(0, -1);
    }
    // make first letter lowercase
    return text.charAt(0).toLowerCase() + text.slice(1);
}

// export type definition of API
export type EmailRouter = typeof emailRouter;