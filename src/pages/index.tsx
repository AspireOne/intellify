import type {NextPage} from 'next'
import React, {PropsWithChildren, useEffect, useRef} from "react";
import Typed from "typed.js";

import {motion} from 'framer-motion';
import {useSession} from "next-auth/react";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import Button, {Style} from "../components/Button";
import Link from "next/link";
import {paths} from "../lib/constants";
import {twMerge} from "tailwind-merge";
import {IoRocketOutline} from "react-icons/io5";
import {BiCodeAlt} from "react-icons/bi";
import {BsTextLeft} from "react-icons/bs";
import img from "../../public/assets/c-shape-blur.svg";
import NoPaddingDiv from "../components/NoPaddingDiv";


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);
    const session = useSession();

    const [isPc, setIsPc] = React.useState(true);

    useEffect(() => {
        const handleResize = () => setIsPc(window.innerWidth > 1000);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [typeof window]);

    useEffect(() => {
        // If it slows down the website, stop typing when it is not visible.
        const typed = new Typed(el.current || "", {
            strings: ["Úpravu textu.", "Obsah prezentací.", "Programování."], // Strings to display
            // Speed settings, try diffrent values untill you get good results
            startDelay: 500,
            typeSpeed: 75,
            backSpeed: 50,
            backDelay: 800,
            loop: true,
            cursorChar: ""
        });

        return () => typed.destroy();
    }, []);

    return (
        <NoPaddingDiv style={{
            backgroundImage: `linear-gradient(to bottom, #0f1524 0%, transparent 120%),linear-gradient(to top, #0f1524 0%, transparent 0%), url('/assets/luminosity.svg')`,
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
        }} className={"bg-fit"}>
            <div style={{
                backgroundImage: `linear-gradient(0deg,#0f1524 0%, transparent 22%),url('/assets/cybergrid.png')`,
                }} className={"mb-32 bg-cover w-full h-screen relative"}>
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    transition={{duration: 0.6}}
                    animate={{opacity: 1, y: 0}}
                    className={"text-center mt-44 mx-auto px-2 max-w-[800px] min-h-full"}
                >
                    <div className={"flex flex-col gap-10 text-center justify-center"}>
                        <Title className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font m-0">
                            Nejlepší A.I. Nástroj na
                            <div className={"sm:my-4"}/>
                            <span className={"title-highlighted"} ref={el}></span>
                            <img
                                className={"transform -translate-y-2 sm:-translate-y-3 inline animate-pulse duration-100 h-[3.5rem] sm:h-[4rem] md:h-[5.4rem]"}
                                src={"https://global-uploads.webflow.com/627a1044a798e6627445c8d1/62b15f383fdee46ecf39db49_line.svg"}></img>
                        </Title>
                        <Subtitle className={"mx-4 md:mx-12 text-md sm:text-lg md:text-xl lg:text-2xl sm:leading-8"}>
                            Vytvářejte obsah a dokončujte projekty 10X rychleji.
                            <br className={"hidden sm:block"}/>{" "}
                            Usnadněte si svou každodenní práci.
                        </Subtitle>
                    </div>

                    <Button className={"text-lg mt-12 h-14 w-48 text-gray-200 font-bold"}>
                        <Link href={paths.sign}>
                            Přihlásit se
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <div
                style={{
                    backgroundImage: `linear-gradient(to bottom, #0f1524 0%, transparent 130%),linear-gradient(to top, #0f1524 0%, transparent 0%), url('/assets/rect.svg')`,
                    backgroundPosition: "center bottom",
                    backgroundRepeat: "no-repeat",
                }}
                className={"flex flex-col gap-40 md:gap-52 pb-72 px-5 md:px-16"}>
                <TextElementPair
                    text={"Revolucionalizujte svůj workflow ⚡"}
                    element={
                        <img src={"/assets/about-image.svg"} className={"h-64 mx-auto"}/>}
                    textSide={isPc && "left"}
                >
                    Naše nástroje založené na umělé inteligenci jsou navrženy tak, aby vaši práci usnadnily, zrychlily a zefektivnily.
                    S naší sadou nástrojů můžete automatizovat časově náročné úkoly, zlepšit svůj pracovní postup a dosáhnout více v
                    kratším čase.
                </TextElementPair>

                {/*TODO: Make parts of text light blue or etc.?*/}
                <TextElementPair
                    text={"Rozviňte svou kreativitu 💡"}
                    element={<img src={"/assets/ai.png"} className={"mx-auto h-56"}/>}
                    textSide={isPc && "right"}
                >
                    A.I. vám dává jedinečnou možnost nahlédnout za horizont představivosti, který byste vy sami neobjevili - přizpůsobeně
                    vašemu tempu a stylu. Použijte jej jako kreativního asistenta k brainstormování nápadů nebo postupů, psaní zápletek
                    nebo emailů, rozšiřování textu, a mnoho dalšího. Už se netrapte tvůrčím blokem.
                </TextElementPair>

                <TextElementPair text={"Bezpečnost a soukromí jsou naší prioritou 🔒"}
                                 element={<img src={"/assets/shield.png"} className={"mx-auto h-64 w-auto"}/>}
                                 textSide={isPc && "left"}>
                    Věříme, že soukromí a bezpečnost vašich dat by měla být na prvním místě. Nástroje jsou
                    navrženy s ohledem na bezpečnost a všechna data jsou zpracována a uchovávána v souladu s nejmodernějšími
                    standardy ochrany dat a osobních údajů. Můžete si být jisti, že vaše data jsou u nás v bezpečí.
                </TextElementPair>

                <TextElementPair
                    text={"Připojte se k převratu A.I. ✊"}
                    element={<img src={"/assets/globe.png"} className={"mx-auto h-72"}/>}
                    textSide={isPc && "right"}
                >
                <span className={"block"}>
                    Připojte se k rostoucímu počtu profesionálů, kteří využívají sílu umělé inteligence k tomu, aby výsledky své práce
                dostali na další úroveň. Naše nástroje jsou snadno použitelné, cenově dostupné a navrženy tak, aby vám pomohly dosáhnout
                více v kratším čase.
                </span>
                    <Button className={"mt-4 w-44"}>
                        <Link href={paths.sign} className={"text-sm font-bold"}>Připojit se</Link>
                    </Button>

                </TextElementPair>
            </div>

            {/*Cards with the specific tools*/}

            {/*kkt*/}
            <div className="bg-[rgba(255,255,255,0.02)] min-h-screen text-white py-36 mb-32 rounded-b-3xl">
                <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                    <Title>Vytvářejte prezentace, sestavte si životopis, programujte...</Title>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-10">
                        <FeatureCard
                            icon={<IoRocketOutline className="h-10 w-10 text-white" />}
                            title={"Vytváření prezentací"}
                            items={[
                                "Tvořte prezentace během vteřin",
                                "Přizpůsobte si parametry do jediného detailu",
                                "Zajistěte profesionální kvalitu a vzhled",
                            ]}>
                            Proces tvoření prezentací - zjednodušený na vteřiny.
                        </FeatureCard>

                        <FeatureCard
                            icon={<BsTextLeft className="h-10 w-10 text-white" />}
                            title={"Editování textů"}
                            items={[
                                "Upravujte texty podle vašeho zadání",
                                "Vylepšujte své texty pomocí doporučení",
                                "Opravujte gramatiku a pravopis",
                            ]}
                        >
                            Tvoření a upravování textů - změňte tón, zvýrazněte myšlenky, nebo si nechte napsat
                            průvodní dopis.
                        </FeatureCard>
                        <FeatureCard
                            icon={<BiCodeAlt className="h-10 w-10 text-white" />}
                            title={"Programování"}
                            items={[
                                "Zvyšte rychlost kódování",
                                "Předejděte chybám a zlepšete kvalitu kódu",
                                "Nechte si udělat více času na kávu :)",
                            ]}
                        >
                            Upravování, vylepšování, nebo rozšiřování kódu. Poskytuje doporučení a odpověni na
                            otázky ohledné kódu.
                        </FeatureCard>
                    </div>

                    <div className={"flex flex-col sm:flex-row sm:items-center gap-5 mt-8"}>
                        <Title size={3} className={"text-gray-300"}>... A mnohem více</Title>
                        <span className={"hidden sm:block"}>•</span>
                        <Button style={Style.OUTLINE} className={"sm:w-content"}>
                            <Link className={"w-content"} href={paths.tools}>Prohlédnout všechny nástroje</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{backgroundImage: `linear-gradient(0deg,#0f1524 0%, transparent 22%),url('/assets/c-shape-blur.svg')`, backgroundSize: "2800 2000"}}
                          className={"w-full bg-cover flex justify-center px-4 sm:py-32 sm:min-h-min h-screen"}>
                <div className={"w-full h-full flex flex-col items-center justify-center text-center -mt-4"}>
                    <Title className={"mb-4"}>Vyzkoušejte si to ještě dnes</Title>
                    <Button className={"w-52"}>
                        <Link href={paths.sign}>Registrovat se</Link>
                    </Button>
                </div>
            </div>

            {/*<div className={"w-full overflow-x-hidden"}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250">
                    <g mask="url(&quot;#SvgjsMask1003&quot;)" fill="none">
                        <path d="M22 250L272 0L378.5 0L128.5 250z" fill="url(#SvgjsLinearGradient1004)"></path>
                        <path d="M260.6 250L510.6 0L707.1 0L457.1 250z" fill="url(#SvgjsLinearGradient1004)"></path>
                        <path d="M486.20000000000005 250L736.2 0L859.2 0L609.2 250z" fill="url(#SvgjsLinearGradient1004)"></path>
                        <path d="M713.8000000000001 250L963.8000000000001 0L1088.3000000000002 0L838.3000000000001 250z" fill="url(#SvgjsLinearGradient1004)"></path>
                        <path d="M1401 250L1151 0L1085 0L1335 250z" fill="url(#SvgjsLinearGradient1005)"></path>
                        <path d="M1201.4 250L951.4000000000001 0L634.9000000000001 0L884.9000000000001 250z" fill="url(#SvgjsLinearGradient1005)"></path>
                        <path d="M954.8 250L704.8 0L359.79999999999995 0L609.8 250z" fill="url(#SvgjsLinearGradient1005)"></path>
                        <path d="M705.1999999999999 250L455.19999999999993 0L224.19999999999993 0L474.19999999999993 250z" fill="url(#SvgjsLinearGradient1005)"></path>
                        <path d="M1298.9492919044765 250L1440 108.94929190447635L1440 250z" fill="url(#SvgjsLinearGradient1004)"></path>
                        <path d="M0 250L141.05070809552365 250L 0 108.94929190447635z" fill="url(#SvgjsLinearGradient1005)"></path>
                    </g>
                    <defs>
                        <mask id="SvgjsMask1003">
                            <rect width="1440" height="250" fill="#ffffff"></rect>
                        </mask>
                        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1004">
                            <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
                            <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
                        </linearGradient>
                        <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1005">
                            <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
                            <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </div>*/}
        </NoPaddingDiv>
    );
}

function FeatureCard(props: PropsWithChildren<{ icon: JSX.Element, title: string, items: string[] }>) {
    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center h-20 w-20 bg-gray-900 rounded-md mb-4">
                {props.icon}
            </div>
            <h2 className="text-xl font-bold mb-2">{props.title}</h2>
            <p className="text-gray-400 mb-4">{props.children}</p>
            <ul className="text-gray-400">
                {props.items.map((item) => <li key={item}>• {item}</li>)}
            </ul>
        </div>
    );
}

/**
 * Creates a pair of text and element for the landing page. Text next to the element.
 * @param props.text Text to display
 * @param props.element Element to display
* */
function TextElementPair(props: PropsWithChildren<{ text: string, element: JSX.Element, className?: string, textSide: "left" | "right" | undefined | null | false }>) {
    // Sadly, tailwind has a buggy conditional class merging, so we have to do it manually instead of setting
    // flex-reverse-wrap.
    const Text = (
        <div className={"w-full"}>
            <Title className={"mb-3"}>{props.text}</Title>
            <Subtitle className={""}>{props.children}</Subtitle>
        </div>
    );

    const Element = (
        <div className={"w-full"}>
            {props.element}
        </div>
    );

    const One = props.textSide === "right" ?  Element : Text;
    const Two = props.textSide === "right" ? Text : Element;

    return (
        // TODO: Change it to md.
        <div className={twMerge(`flex flex-col lg:flex-row gap-10 items-center ${props.className}`)}>
            {One}
            {Two}
        </div>
    );
}

export default Home