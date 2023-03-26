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

import {FaRegLightbulb, FaRobot} from "react-icons/fa";
import {AiOutlineCode, AiOutlineFileText, AiOutlineThunderbolt} from "react-icons/ai";
// import BiCodeAlt, IoRocketOutline
import {IoMdRocket} from 'react-icons/io';
import {CgPresentation} from 'react-icons/cg';
import {GrDocumentText} from 'react-icons/gr';
import {IoRocketOutline} from "react-icons/io5";
import {BiCodeAlt} from "react-icons/bi";
import Card from "../components/Card";
import CheckmarkSvg from "../components/CheckmarkSvg";


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
        <div>
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

            <TextElementPair
                text={"Revolucionalizujte svůj workflow ⚡"}
                element={<AiOutlineThunderbolt/>}
                textSide={"left"}
            >
                Naše nástroje založené na umělé inteligenci jsou navrženy tak, aby vaši práci usnadnily, zrychlily a zefektivnily.
                S naší sadou nástrojů můžete automatizovat časově náročné úkoly, zlepšit svůj pracovní postup a dosáhnout více v
                kratším čase.
            </TextElementPair>

            {/*TODO: Make parts of text light blue or etc.?*/}
            <TextElementPair
                text={"Rozvíjejte svou kreativitu 💡"}
                element={<FaRegLightbulb />}
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
                element={<AiOutlineFileText />}
                textSide={"right"}
            >
                <span>
                    Připojte se k rostoucímu počtu profesionálů, kteří využívají sílu umělé inteligence k tomu, aby výsledky své práce
                dostali na další úroveň. Naše nástroje jsou snadno použitelné, cenově dostupné a navrženy tak, aby vám pomohly dosáhnout
                více v kratším čase.
                </span>
                <Button style={Style.OUTLINE} className={"mt-4 float-right"}>Připojit se</Button>
            </TextElementPair>

            {/*Cards with the specific tools*/}


            <div className="bg-gray-900 min-h-screen text-white py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Title>Vytvářejte prezentace, editujte texty, programujte...</Title>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-8">
                        <FeatureCard
                            icon={<IoRocketOutline className="h-10 w-10 text-white" />}
                            title={"Vytváření prezentací"}
                            items={[
                                "Vytvořte prezentaci během vteřin",
                                "Přizpůsobte si parametry dle potřeby",
                                "Vytvářejte profesionální a vizuálně příjemné prezentace",
                            ]}>
                            Tento nástroj vám umožní vytvářet rozsáhlé prezentace během
                            vteřin. Je navržen tak, aby proces vytváření profesionálních,
                            vizuálně příjemných prezentací byl rychlý a snadný.
                        </FeatureCard>

                        <FeatureCard
                            icon={<AiOutlineFileText className="h-10 w-10 text-white" />}
                            title={"Editování textů"}
                            items={[
                                "Upravujte texty rychle a snadno",
                                "Vylepšujte své texty pomocí doporučení od našeho A.I.",
                                "Upravujte gramatiku a pravopis díky naší A.I. technologii",
                            ]}
                        >
                            Tento nástroj vám umožní editovat texty rychleji a snadněji díky naší A.I. technologii.
                        </FeatureCard>
                        <FeatureCard
                            icon={<BiCodeAlt className="h-10 w-10 text-white" />}
                            title={"Programování"}
                            items={[
                                "Zvyšte rychlost kódování s naší A.I. technologií",
                                "Využijte doporučení od našeho A.I. při psaní kódu",
                                "Programujte efektivněji a s menším množstvím chyb",
                            ]}
                        >
                            Tento nástroj vám umožní programovat rychleji a efektivněji díky naší A.I. technologii,
                            která vám pomůže s kódováním.
                        </FeatureCard>
                    </div>

                    <div className={"flex flex-row items-center gap-5"}>
                        <Title size={3} className={"text-gray-300"}>... A mnohem více</Title>
                        <span>•</span>
                        <Button>Přihlásit se</Button>
                    </div>
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
    const flexDirection = props.textSide === "right" ? "flex-row-reverse" : "flex-row";

    return (
        // TODO: Change it to md.
        <div className={twMerge(`flex flex-col sm:${flexDirection} gap-10 items-center ${props.className}`)}>
            <div className={"w-full"}>
                <Title className={"mb-3"}>{props.text}</Title>
                <Subtitle className={""}>{props.children}</Subtitle>
            </div>
            <div className={"w-full"}>
                <div className={"mx-auto w-min"}>
                    {props.element}
                </div>
            </div>
        </div>
    );
}

export default Home