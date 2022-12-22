// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export type PresParams = {
    topic: string,
    slides: number,
    points: number,
    description: string|undefined,
    introduction: boolean,
    conclusion: boolean,
    includeImages: boolean
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
    console.log(params);
    console.log(params.introduction);
    if (params.description) {
        // Ensure there is a dot at the end of the description.
        if (!(params.description as string).endsWith('.')) params.description += '.';
        params.description += " ";
    }
    return `Vytvoř prezentaci na téma ${params.topic}. ${params.description ?? ""}Počet slidů: ${params.slides}. Počet bodů v každém slidu: ${params.points}. Každý slide bude mít název a každý bod bude odrážka.${params.introduction ? " Napiš úvod." : ""}${params.conclusion ? " Napiš Závěr." : ""}`;
}

async function askAI(prompt: string): Promise<string|null> {
    return "Úvod\n" +
        "Poníci jsou malí, krásní a milí. Jsou oblíbenými domácími mazlíčky po celém světě. V této prezentaci se podíváme na to, co je poníkům nejbližší a proč jsou tak oblíbené.\n" +
        "\n" +
        "Slide 1: Dějiny poníků\n" +
        "- První zmínka o ponících se datuje do starověku, kdy byly použity jako společníci pro děti. \n" +
        "- Byli také využiti jako dopravní prostředky a pracovní síla v zemědělství.\n" +
        "\n" +
        "Slide 2: Proč jsou poníci oblíbeni? \n" +
        "- Poníci jsou velmi milujicí a oddaný partner pro děti i dospělé. \n" +
        "- Jsou kamarádskými a inteligentnimi zvířaty, která dokážou vytvářet silné pouto s člověkem. \n" +
        "\n" +
        "Závěr \n" +
        "Ponik je nesporně jedinečným zvirem, které si vysloužilo své miesto v srdcich lidi po celém svete. Jejich láska, oddanost a inteligence je činila oblibenymi domacimi mazlicky po generace.";

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
