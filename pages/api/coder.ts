import {NextApiRequest, NextApiResponse} from "next";
import {PresentationProps} from "./presentation";
import {Configuration, OpenAIApi} from "openai";

export interface CoderParams {
    code: string,
    command: string,
    type: "command" | "question"
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).send({error: "Only POST requests are allowed."});
        return;
    }

    const params = req.body as CoderParams;

    // Check props data presence.
    if (/*!props.code || */!params.command || !params.type) {
        res.status(400).json({ error: 'Missing one or more parameters.' });
        return;
    }

    const prompt: string = generatePrompt(params);

    let output = await askAI(prompt);
    if (output) output = (output as string).trim();

    return output === null
        ? res.status(500).json({ error: 'AI failed to createPptx AiOutput.' })
        : res.status(200).json({ output: output });
}

function generatePrompt(params: CoderParams): string {
    if (params.type === "command") return params.command + "\n\n" + params.code;
    else {
        return params.code + "\n\n" + "Otázka: " + params.command + "\n\n" + "Odpověď: ";
    }
}

async function askAI(prompt: string): Promise<string | null> {
    //return "adsadsadmas dmkasmdk asmkd masd mkasdmk asmk dasmk";
    const body = {
        model: "text-davinci-003",
        temperature: 0.38,
        max_tokens: 1300,
        frequency_penalty: 0.05,
        presence_penalty: 0.05,
        prompt: prompt,
    };

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // TODO: Use Curie?
    const completion = await openai.createCompletion(body);

    return completion.data.choices[0].text ?? null;
}