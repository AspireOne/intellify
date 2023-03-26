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

import {FaRegLightbulb} from "react-icons/fa";
import {AiOutlineFileText, AiOutlineThunderbolt} from "react-icons/ai";
// import BiCodeAlt, IoRocketOutline
import {IoRocketOutline} from "react-icons/io5";
import {BiCodeAlt} from "react-icons/bi";
import {BsTextLeft} from "react-icons/bs";


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);
    const session = useSession();

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
        <div className={""}>
            <div className={"w-full h-screen relative"}>
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
                        <Subtitle className={"mx-12 text-lg sm:text-xl lg:text-2xl sm:leading-8"}>
                            Vytvářejte obsah a dokončujte projekty 10X rychleji,
                            <br className={"hidden sm:block"}/>{" "}
                            nebo si nechte usnadnit svou každodenní práci.
                        </Subtitle>
                    </div>

                    <Link href={paths.sign}>
                        <Button className={"mt-12 h-12 w-44 text-gray-200 font-bold text-md"}>Začít používat</Button>
                    </Link>
                </motion.div>
            </div>

            <div className={"flex flex-col gap-32 mb-32"}>
                <TextElementPair
                    text={"Revolucionalizujte svůj workflow ⚡"}
                    element={<div></div>}
                    textSide={"left"}
                >
                    Naše nástroje založené na umělé inteligenci jsou navrženy tak, aby vaši práci usnadnily, zrychlily a zefektivnily.
                    S naší sadou nástrojů můžete automatizovat časově náročné úkoly, zlepšit svůj pracovní postup a dosáhnout více v
                    kratším čase.
                </TextElementPair>

                {/*TODO: Make parts of text light blue or etc.?*/}
                <TextElementPair
                    text={"Rozvíjejte svou kreativitu 💡"}
                    element={<div></div>}
                    textSide={"right"}
                >
                    A.I. vám dává jedinečnou možnost nahlédnout za horizont představivosti, který byste vy sami neobjevili - přizpůsobeně
                    vašemu tempu a stylu. Použijte jej jako kreativního asistenta k brainstormování nápadů nebo postupů, psaní zápletek
                    nebo emailů, rozšiřování textu, a mnoho dalšího. Už se netrapte tvůrčím blokem.
                </TextElementPair>

                <TextElementPair text={"Bezpečnost a soukromí jsou naší prioritou 🔒"} element={<div></div>} textSide={"left"}>
                    Věříme, že soukromí a bezpečnost vašich dat by měla být na prvním místě. Nástroje jsou
                    navrženy s ohledem na bezpečnost a všechna data jsou zpracována a uchovávána v souladu s nejmodernějšími
                    standardy ochrany dat a osobních údajů. Můžete si být jisti, že vaše data jsou u nás v bezpečí.
                </TextElementPair>

                <TextElementPair
                    text={"Připojte se k převratu A.I. ✊"}
                    element={<div></div>}
                    textSide={"right"}
                >
                <span className={"block"}>
                    Připojte se k rostoucímu počtu profesionálů, kteří využívají sílu umělé inteligence k tomu, aby výsledky své práce
                dostali na další úroveň. Naše nástroje jsou snadno použitelné, cenově dostupné a navrženy tak, aby vám pomohly dosáhnout
                více v kratším čase.
                </span>
                    <Button className={"mt-4"}>Připojit se</Button>
                </TextElementPair>
            </div>

            {/*Cards with the specific tools*/}

            <div className="bg-gray-900 min-h-screen text-white py-32 my-32 -mx-[1.2rem] rounded-3xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Title>Vytvářejte prezentace, editujte texty, programujte...</Title>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 mb-8">
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

                    <div className={"flex flex-row items-center gap-5"}>
                        <Title size={3} className={"text-gray-300"}>... A mnohem více</Title>
                        <span>•</span>
                        <Link href={paths.tools}>
                            <Button style={Style.OUTLINE}>Zobrazit všechny nástroje</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={"flex justify-center my-32"}>
                <div className={"text-center"}>
                    <Title className={"mb-4"}>Připojte se ještě dnes</Title>
                    <Button className={"w-52"}>Registrovat se</Button>
                </div>
            </div>
        </div>
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
function TextElementPair(props: PropsWithChildren<{ text: string, element: JSX.Element, className?: string, textSide: "left" | "right" }>) {
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
            <div className={"mx-auto w-min"}>
                {props.element}
            </div>
        </div>
    );

    const One = props.textSide === "left" ? Text : Element;
    const Two = props.textSide === "left" ? Element : Text;

    return (
        // TODO: Change it to md.
        <div className={twMerge(`flex flex-col lg:flex-row gap-10 items-center ${props.className}`)}>
            {One}
            {Two}
        </div>
    );
}

export default Home