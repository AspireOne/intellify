import {z} from "zod";

export const createPresentationInput = z.object({
    topic: z.string().min(1, {message: "Téma je povinné."}).max(300, "Maximální délka tématu překročena."),
    slides: z.number().min(1, {message: "Počet snímků je povinný."}).max(20, {message: "Maximální počet snímků překročen."}),
    points: z.number().min(1, {message: "Počet bodů je povinný."}).max(10, {message: "Počet bodů překročen."}),
    description: z.string().max(2000, "Maximální délka popisu překročena.").default("").optional(),
    introduction: z.boolean().default(false).optional(),
    conclusion: z.boolean().default(false).optional(),
    includeImages: z.boolean().default(false).optional(),
    describe: z.boolean().default(false).optional(),
});

export const createPresentationOutput = z.object({output: z.string()});