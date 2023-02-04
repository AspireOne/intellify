import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import {Configuration, OpenAIApi} from "openai";
import clientPromise from "../lib/mongodb";
import bcrypt from "bcrypt";
import {Db} from "mongodb";


const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);
let db: Db;
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
    const session = await getSession({ req: opts.req });

    return {
        session,
        openai,
        db: async () => db ?? (db = (await clientPromise).db())
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;