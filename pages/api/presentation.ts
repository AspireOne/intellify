// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";
import * as https from "https";

export type PresParams = {
    topic: string,
    slides: number,
    points: number,
    description: string|undefined,
    introduction: boolean,
    conclusion: boolean,
    includeImages: boolean,
    describe: boolean,
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    /*if (req.method !== 'POST') {
        res.status(405).send("Only POST requests are allowed.");
        return;
    }

    const params = req.body as PresParams;*/

    // Or the below.

    const params = req.query as unknown as PresParams;

    // Check params data presence.
    if (params.topic === undefined || params.slides === undefined || params.points === undefined) {
        res.status(400).json({ error: 'Missing one or more parameters.' });
        return;
    }

    const prompt: string = generatePrompt(params);
    let stop: string[] = [];
    if (!params.conclusion && !params.describe) stop = ["Vysvětlení bodů:", "Závěr:", "Shrnutí:", "[DONE]"];
    let output = await askAI(prompt, stop);

    return output === null
        ? res.status(500).json({ error: 'AI failed to generate output.' })
        : res.status(200).json({ output: output });
}

function generatePrompt(params: PresParams): string {
    if (params.description) {
        params.description = params.description.trim();
        // if params.description ends with a dot, remove that dot.
        if (params.description.endsWith('.')) params.description = params.description.slice(0, -1);
    }
    return `Vytvoř prezentaci na téma ${params.topic}. ${params.description ?? ""}. Počet slidů: ${params.slides}. Počet odrážek v každém slidu: ${params.points}. Každý slide bude mít název. Odrážky by ${"ne" ?? ""}měly obsahovat text.${params.introduction ? " Napiš i úvod." : ""}${params.conclusion ? " Napiš i Závěr." : ""}${params.describe ? " Na konci prezentace každou odrážku popiš." : ""} Příklad struktury:
Slide 1: Název prvního slidu
1. Název prvního bodu
2. Název druhého bodu

Slide 2: Název druhého slidu
1. Název prvního bodu
2. Název druhého bodu

...

Vysvětlení bodů:

Název bodu: popis

Název bodu: popis

Název bodu: popis

...`;
}

async function askAI(prompt: string, stop?: string[]): Promise<string|null> {
    /*return "Úvod\n" +
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
        "Ponik je nesporně jedinečným zvirem, které si vysloužilo své miesto v srdcich lidi po celém svete. Jejich láska, oddanost a inteligence je činila oblibenymi domacimi mazlicky po generace.";*/

    const body = {
        model: "text-davinci-003",
        temperature: 0.1,
        max_tokens: 900,
        frequency_penalty: 0.5,
        presence_penalty: 0.4,
        prompt: prompt,
        stream: true,
        stop: stop ? stop : [],
    };


    const req = https.request({
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

    return null;

    // Or the below.

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // TODO: Use Curie?
    const completion = await openai.createCompletion(body);

    return completion.data.choices[0].text ?? null;
}
