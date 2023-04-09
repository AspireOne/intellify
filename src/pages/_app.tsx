import '../../styles/globals.css'
import type {AppProps} from 'next/app'
import Sidebar from "../components/Sidebar";
import React, {useEffect} from "react";
import Footer from "../components/Footer";
import {SessionProvider} from "next-auth/react";
import {trpc} from "../lib/trpc";
import {SkeletonTheme} from "react-loading-skeleton";
import { MantineProvider } from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import ReactGA from "react-ga4";

/*ReactGA.initialize("G-N556CF5Z13");*/

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    /*useEffect(() => {
        // initialize google analytics 4.
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];

        // @ts-ignore
        function gtag(){dataLayer.push(arguments)}
        // @ts-ignore
        gtag('js', new Date());
        // @ts-ignore
        gtag('config', 'G-N556CF5Z13');
    }, []);*/
    return (
        <SessionProvider session={session} refetchOnWindowFocus={true} refetchInterval={60 * 3}>
            <SkeletonTheme baseColor={"rgba(255, 255, 255, 0.05)"} highlightColor={"rgba(255, 255, 255, 0.4)"}>
                <div className="text-gray-100 dark leading-6 bg-bgcolor">
                    <MantineProvider theme={{
                        colorScheme: 'dark',
                        primaryColor: 'brand',
                        colors: {
                            // override dark colors to change them for all components

                            brand: [
                                '#EDE7F6',
                                '#EDE7F6',
                                '#B39DDB',
                                '#9575CD',
                                '#7E57C2',
                                '#673AB7',
                                '#5E35B1',
                                '#512DA8',
                                '#4527A0',
                                '#311B92'
                            ],
                        },
                    }} withNormalizeCSS>
                        <Notifications />
                        <div className="flex min-h-screen">
                            <Sidebar/>
                            {/*3*/}
                            <main className={"p-3 sm:p-5 w-full relative"}>
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