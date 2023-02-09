import {z} from "zod";
export const generateInput = z.object({
    prompt: z.string().min(1, "Prompt je povinný.").max(3500, "Maximální délka promptu překročena."),
    temperature: z.number().min(0, "Minimální kreativita je 0.").max(1, "Maximální teplota je 1.").optional().default(0.5),
});

export const generateOutput = z.object({response: z.string()});