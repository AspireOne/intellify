import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';
import { createContext } from "../../../server/context";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: createContext,
    onError({ error, type, path, input, ctx, req }) {
        if (process.env .NODE_ENV === "development") {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
        }

        if (error.code === 'INTERNAL_SERVER_ERROR') {
            // TODO: send to bug reporting.
        }

        // Change the error message because in new versions of tRPC there is a
        // changed behavior where error.message is not the message, but rather an array
        // with error objects (which contain the error messages) in string format, even if there is
        // only one.
        //
        // That could be good for debugging, but we are already using the message property to show
        // user friendly errors in the frontend.
        //
        // Thats why we will alter the error message here - if it is an array, we will extrac
        // all the messages and join them with a comma.
        if (error.message[0] === "[") {
            const messages = (JSON.parse(error.message) as any[]).map((error) => error.message);
            error.message = messages.join(" • ");
        }
    },
});