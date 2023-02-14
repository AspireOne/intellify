import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Sidebar from "../components/Sidebar";
import React from "react";
import Footer from "../components/Footer";
import {SessionProvider} from "next-auth/react";
import {trpc} from "../utils/trpc";
import {SkeletonTheme} from "react-loading-skeleton";

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <SessionProvider session={session} refetchOnWindowFocus={false}>
            <SkeletonTheme baseColor={"rgba(255, 255, 255, 0.05)"} highlightColor={"rgba(255, 255, 255, 0.4)"}>
                <div className="text-gray-100 dark">
                    <div className="flex">
                        <Sidebar/>
                        <main className={"px-3 pt-3 sm:p-5 w-full"}>
                            <Component {...pageProps} />
                        </main>
                    </div>
                    <Footer/>
                </div>
            </SkeletonTheme>
        </SessionProvider>
    );
}

export default trpc.withTRPC(MyApp);