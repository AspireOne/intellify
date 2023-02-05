// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {getToken} from "next-auth/jwt";
import {paths} from "./lib/constants";

//documentation, cookies, sessions etc.: https://nextjs.org/docs/advanced-features/middleware
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    if (req.url.includes(paths.sign)) {
        if (await isSignedIn(req)) return NextResponse.redirect(new URL(paths.index, req.url));
    }

    if (req.url.includes(paths.profile)) {
        if (!await isSignedIn(req)) return NextResponse.redirect(new URL(paths.sign, req.url));
    }

    /*const session = await getToken({ req, secret: process.env.SECRET })
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    if (!session) return NextResponse.redirect("/api/auth/signin")*/

    //return NextResponse.redirect(new URL('/about-2', req.url))
    return NextResponse.next()
}

async function isSignedIn(req: NextRequest): Promise<boolean> {
    return getToken({ req, secret: process.env.SECRET })
        .then((session) => session !== null && session !== undefined)
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
}