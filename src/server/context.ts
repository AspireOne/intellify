import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import {Configuration, OpenAIApi} from "openai";
import mongooseConnect from "../lib/mongooseConnect";
import {FetchCreateContextFnOptions} from "@trpc/server/adapters/fetch";


const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts?: trpcNext.CreateNextContextOptions | FetchCreateContextFnOptions ) {
    // Do this terrible hack so that we can create context in SSG Helpers. If a procedure is used for SSG with this context,
    // it MUST NOT use session data or opts, because they might be null.
    opts = opts as trpcNext.CreateNextContextOptions;

    const session = await getSession({ req: opts?.req });

    return {
        session,
        openai,
        connectDb: mongooseConnect,
        req: opts?.req,
        res: opts?.res
    };
};

export async function createContextInner(opts?: trpcNext.CreateNextContextOptions) {
    const session = opts?.req && await getSession({ req: opts.req });

    return {
        session,
        openai,
        connectDb: mongooseConnect,
        req: opts?.req,
        res: opts?.res
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;