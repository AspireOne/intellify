import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Sidebar from "../components/Sidebar";
import React from "react";
import Footer from "../components/Footer";
import {SessionProvider} from "next-auth/react";
import SmoothScroll from "../components/SmoothScroll";
import {trpc} from "../utils/trpc";

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <SessionProvider session={session}>
            {/*bg-[linear-gradient(180deg,rgba(90,80,250,1)_0%,rgba(14,20,35,1)_7%)] */}
            <div className="text-white">
                <div className="flex">
                    <Sidebar/>
                    <main className={"p-5 w-full"}>
                        <Component {...pageProps} />
                    </main>
                </div>
                <Footer/>
            </div>
        </SessionProvider>
    );
}

export default trpc.withTRPC(MyApp);