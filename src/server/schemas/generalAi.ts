import {z} from "zod";
export const generateInput = z.object({
    prompt: z.string().min(1, "Prompt je povinný.").max(3500, "Maximální délka promptu překročena."),
});

export const generateOutput = z.object({response: z.string()});