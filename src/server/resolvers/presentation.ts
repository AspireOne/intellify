import {z} from "zod";
import {createPresentationInput, createPresentationOutput} from "../schemas/presentation";
import {Context} from "../context";
import Utils from "../lib/utils";

export async function createPresentationResolver(ctx: Context, input: z.input<typeof createPresentationInput>): Promise<z.output<typeof createPresentationOutput>> {

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
             "Ponik je nesporně jedinečným zvirem, které si vysloužilo své miesto v srdcich lidi po celém svete. Jejich láska, oddanost a inteligence je činila oblibenymi domacimi mazlicky po generace.";
*/

        const prompt: string = generatePrompt(input);
        let stop: string[] | undefined;
        if (!input.conclusion && !input.describe) stop = ["Vysvětlení bodů:", "Závěr:", "Shrnutí:"];

        const output = await Utils.askAi(ctx, {
                model: "text-davinci-003",
                temperature: 0.4,
                max_tokens: 1500,
                frequency_penalty: 0.2,
                presence_penalty: 0.2,
                prompt: prompt,
                stop: stop || undefined,
        });

        return {output: output};
}

function generatePrompt(params: z.input<typeof createPresentationInput>): string {
        if (params.description) {
                params.description = params.description.trim();
                if (!params.description.endsWith('.')) params.description += ".";
                if (!params.description.startsWith(" ")) params.description = " " + params.description;
        }

        let prompt = `Vytvoř prezentaci na téma ${params.topic}.${params.description ?? ""} Počet slidů: ${params.slides}. Počet odrážek v každém slidu: ${params.points}. Každý slide bude mít název. Odrážky by ${"ne" ?? ""}měly obsahovat text.${params.introduction ? " Napiš i úvod." : ""}${params.conclusion ? " Napiš i Závěr." : ""}${params.describe ? " Na konci prezentace každou odrážku popiš." : ""}\nPříklad struktury:`;

        if (params.introduction) prompt += "\n\nÚvod:\nText úvodu";

        prompt +=
            "\n\nSlide 1: Název prvního slidu\n" +
            "1. Název prvního bodu\n" +
            "2. Název druhého bodu\n" +
            "...\n\n" +
            "Slide 2: Název druhého slidu\n" +
            "1. Název prvního bodu\n" +
            "2. Název druhého bodu\n" +
            "\n" +
            "..."

        if (params.conclusion) prompt += "\n\nZávěr:\nText závěru";

        if (params.describe) {
                prompt +=
                    "\n\nVysvětlení bodů:\n" +
                    "Název bodu: popis\n" +
                    "\n" + "Název bodu: popis\n" +
                    "\n" +
                    "Název bodu: popis\n" +
                    "\n" +
                    "..."
        }

        return prompt;
}
