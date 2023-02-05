import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import {Configuration, OpenAIApi} from "openai";
import mongooseConnect from "../lib/mongooseConnect";


const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
    const session = await getSession({ req: opts.req });

    return {
        session,
        openai,
        connectDb: mongooseConnect,
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;