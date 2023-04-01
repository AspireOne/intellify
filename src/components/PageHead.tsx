import Head from "next/head";
import {PropsWithChildren} from "react";

export default function PageHead(props: PropsWithChildren<{title: string, description?: string}>) {
    return (
        <Head>
            <title>{props.title + " | Open Tools"}</title>
            {props.description && <meta key={"page-description"} name="description" content={props.description} />}
            {props.children}
        </Head>
    )
}