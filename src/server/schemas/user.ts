import {z} from "zod";
export const updateDataInput = z.object({
    email: z.string()
        .email({message: "Neplatný email."})
        .max(255, {message: "Maximální délka emailu překročena."})
        .optional(),
    password: z.string()
        .max(100, {message: "Maximální délka hesla překročena."})
        .optional(),
    name: z.string()
        .max(100, {message: "Maximální délka jména překročena."})
        .optional(),
    image: z.string()
        .url({message: "Neplatná URL."})
        .max(255, {message: "Maximální délka obrázku překročena."})
        .optional(),
});

export const updateDataOutput = z.object({message: z.string()});