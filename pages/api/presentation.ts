// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export type QueryParams = {
    topic: string|unknown,
    slides: number|unknown,
    points: number|unknown,
    description: string|undefined|unknown
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const query: QueryParams = req.query as unknown as QueryParams;

    // Check query data presence.
    if (query.topic === undefined && query.slides === undefined && query.points === undefined) {
        res.status(400).json({ error: 'Missing query data.' });
        return;
    }

    // Check query data type.
    if (typeof query.topic !== 'string') {
        res.status(400).json({ error: 'Invalid query data.' });
        return;
    }

    const prompt: string = generatePrompt(query);
    let output = await askAI(prompt);

    return output === null
        ? res.status(500).json({ error: 'AI failed to generate output.' })
        : res.status(200).json({ output: output });
}

function generatePrompt(params: QueryParams): string {
    if (params.description) {
        // Ensure there is a dot at the end of the description.
        if (!(params.description as string).endsWith('.')) params.description += '.';
        params.description += " ";
    }
    return `Vytvoř prezentaci na téma ${params.topic}. ${params.description ?? ""}Počet slidů: ${params.slides}. Počet bodů v každém slidu: ${params.points}. Každý slide bude mít nadpis.`;
}

async function askAI(prompt: string): Promise<string|null> {
    return "This is a test text that was hardcoded into the API for testing purposes. Example of a real output: \n\nSlide 1:\n1. Co je to poník? \n2. Jaké jsou druhy poníků?\n\nSlide 2: \n1. Jak se o poníka starat? \n2. Jaké jsou výhody chovu poníka?";
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: .4,
        max_tokens: 1000,
        frequency_penalty: 0.4,
        presence_penalty: 0.4,
        prompt: prompt,
        stop: ["{}"],
    });

    return completion.data.choices[0].text ?? null;
}
