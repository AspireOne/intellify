import {z} from "zod";

export const assistCodeInput = z.object({
    code: z.string().max(2200, "Maximální délka kódu překročena."),
    command: z.string().min(1, {message: "Příkaz je povinný."}).max(500, "Maximální délka příkazu překročena."),
    type: z.enum(["command", "question"]),
});

export const assistCodeOutput = z.object({output: z.string()});