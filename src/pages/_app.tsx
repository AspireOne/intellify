import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Sidebar from "../components/Sidebar";
import React from "react";
import Footer from "../components/Footer";
import {SessionProvider} from "next-auth/react";
import {trpc} from "../lib/trpc";
import {SkeletonTheme} from "react-loading-skeleton";
import { MantineProvider } from '@mantine/core';
import {Notifications} from "@mantine/notifications";

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <SessionProvider session={session} refetchOnWindowFocus={false}>
            <SkeletonTheme baseColor={"rgba(255, 255, 255, 0.05)"} highlightColor={"rgba(255, 255, 255, 0.4)"}>
                <div className="text-gray-100 dark leading-6">
                    <MantineProvider theme={{
                        colorScheme: "dark",
                        /*colors: {
                            main: ["#606e98","#506293","#36456e","#2e3b60","#2a375a","#1d2541","#131b34","#11182f","#121728","#0e1323"]
                        },
                        primaryColor: "main",*/
                    }} withNormalizeCSS>
                        <Notifications />
                        <div className="flex min-h-screen">
                            <Sidebar/>
                            <main className={"px-3 pt-3 sm:p-5 w-full relative"}>
                                <Component {...pageProps} />
                            </main>
                        </div>
                    </MantineProvider>
                    <Footer/>
                </div>
            </SkeletonTheme>
        </SessionProvider>
    );
}

export default trpc.withTRPC(MyApp);