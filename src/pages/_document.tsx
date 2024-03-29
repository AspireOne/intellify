import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang={"cs"}>
            <Head>
                <meta name="author" content="Matěj Pešl" />
                {/*<meta key={"description"} name="description" content="Zrychlete svůj workflow pomocí A.I. nástrojů. Vytvářejte prezentace,
                upravujte texty, pište maily a mnohem více." />*/}

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#665cea"/>
                <meta name="msapplication-TileColor" content="#603cba"/>
                <meta name="theme-color" content="#665cea"/>

                {/* Global Site Tag (gtag.js) - Google Analytics */}
                <script async src={`https://www.googletagmanager.com/gtag/js?id=G-N556CF5Z13`}/>
                <script dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-N556CF5Z13');`,
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}