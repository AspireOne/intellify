import {z} from "zod";
export const generateInput = z.object({
    prompt: z.string().min(1).max(3500)
});

export const generateOutput = z.object({response: z.string()});