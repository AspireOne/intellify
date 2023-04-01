import {z} from "zod";
import {Offer} from "./offers";
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

export const getUserOutput = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    email: z.string(),
    emailVerified: z.boolean(),
    hasPassword: z.boolean(),
    remainingFreeTokens: z.number(),
    subscription: z.object({
        remainingTokens: z.number(),
        updatedAt: z.date(),
        data: Offer,
        cancelled: z.boolean().optional()
    }).optional(),
}).nullable();

export const updateDataOutput = z.object({message: z.string()});