import {protectedProcedure, router} from "../trpc";
import {generateInput, generateOutput} from "../schemas/generalAi";
import {generateResolver} from "../resolvers/generalAi";

// TODO!important: Make the prompt better - specify some context (language čeština etc.), maybe
// something like "Odpověz na obecnou otázku nebo úkol: "... ?
export const generalAiRouter = router({
    generate: protectedProcedure
        .input(generateInput)
        .output(generateOutput)
        .mutation(async ({ctx, input}) => await generateResolver(ctx, input)),
});

// export type definition of API
export type GeneralAiRouter = typeof generalAiRouter;