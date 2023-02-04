import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';
import { createContext } from "../../../server/context";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: createContext,
    onError:
        process.env .NODE_ENV === "development"
            ? ({ path, error }) => {
                console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
            }
            : undefined,
});