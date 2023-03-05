import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang={"cs"} >
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="author" content="Matěj Pešl" />
                {/*TODO: Make the description better.*/}
                {/*TODO: Add head tag (title etc.) for each page.*/}
                <meta name="description" content="Zrychlete svůj workflow pomocí A.I. nástrojů. Vytvářejte prezentace,
                upravujte texty, pište maily a mnohem více." />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}