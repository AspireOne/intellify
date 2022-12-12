// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export type PresParams = {
    topic: string|unknown,
    slides: number|unknown,
    points: number|unknown,
    description: string|undefined|unknown
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const query: PresParams = req.query as unknown as PresParams;

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

function generatePrompt(params: PresParams): string {
    if (params.description) {
        // Ensure there is a dot at the end of the description.
        if (!(params.description as string).endsWith('.')) params.description += '.';
        params.description += " ";
    }
    return `Vytvoř prezentaci na téma ${params.topic}. ${params.description ?? ""}Počet slidů: ${params.slides}. Počet bodů v každém slidu: ${params.points}. Každý slide bude mít název.`;
}

async function askAI(prompt: string): Promise<string|null> {
    return "Slide 1: Ženy ve Společnosti\n" +
        "1. Práva žen: Ženy mají stejná práva jako muži, včetně práva na vzdělání, zaměstnání, politického zastoupení a vlastnictví majetku.\n" +
        "2. Postavení žen: Ve společnosti se postavení žen zlepšuje, ale stále ještě existují rozdíly mezi mužskými a ženskými příjmy a postavením.\n" +
        "3. Genderové stereotypy: Genderové stereotypy jsou stále běžné ve společnosti a mohou mít negativní dopad na postavení žen ve společnosti.\n" +
        "\n" +
        "Slide 2: Role Žen ve Společnosti \n" +
        "1. Rodina: Rodina je obvykle centrem pozornosti pro role žen, které jsou často odpovědné za starání se o rodinu a domácnost. \n" +
        "2. Pracovní sféra: V posledních desetiletích se role žen ve společnosti změnila, protože se staly úspěšnými profesionály v různých oborech. \n" +
        "3. Politika: Role žen v politice se také zvýšila, což umožňuje lepší zastoupení pro otázky týkající se genderu a lidských práv.";
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: .3,
        max_tokens: 1000,
        frequency_penalty: 0.4,
        presence_penalty: 0.4,
        prompt: prompt,
        stop: ["{}"],
    });

    return completion.data.choices[0].text ?? null;
}
