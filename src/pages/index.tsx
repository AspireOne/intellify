import type {NextPage} from 'next'
import React, {PropsWithChildren, useEffect, useRef} from "react";
import Typed from "typed.js";

import {motion} from 'framer-motion';
import {useSession} from "next-auth/react";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import {ArrowDown, ChevronDown} from "react-ionicons";
import Button from "../components/Button";
import Link from "next/link";
import {paths} from "../lib/constants";
import {twMerge} from "tailwind-merge";


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);
    const session = useSession();
    console.log(session.data?.user.id);

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

            <TextElementPair text={"Revolucionalizujte svůj workflow"}
                             element={(<div></div>)}
                             textSide={"left"}>
                Naše nástroje založené na umělé inteligenci jsou navrženy tak, aby vaši práci usnadnily, zrychlily a
                zefektivnily. S naší sadou nástrojů můžete automatizovat časově náročné úkoly, zlepšit svůj pracovní
                postup a dosáhnout více v kratším čase.
            </TextElementPair>

            <TextElementPair text={"Rozvíjejte svou kreativitu"}
                             element={(<div></div>)}
                             textSide={"right"}>
                A.I. vám dává jedinečnou možnost nahlédnout za horizont představivosti, který byste vy sami
                neobjevili - přizpůsobeně vašemu tempu a stylu. Použijte jej jako kreativního asistenta k
                brainstormování nápadů nebo postupů, psaní zápletek nebo emailů, rozšiřování textu, a mnoho dalšího. Už se
                netrapte tvůrčím blokem.
            </TextElementPair>

            <TextElementPair text={"Připojte se k převratu A.I."} element={<div></div>} textSide={"left"}>
                <p>
                    Připojte se k rostoucímu počtu profesionálů, kteří využívají sílu umělé inteligence k tomu, aby výsledky své práce
                    dostali na další úroveň. Naše nástroje jsou snadno použitelné, cenově dostupné a navrženy tak, aby
                    vám pomohly dosáhnout více v kratším čase.
                </p>
                <Button className={"mt-4 float-right"}>Připojit se</Button>
            </TextElementPair>
            
            <TextElementPair text={"Bezpečnost a soukromí jsou naší prioritou"} element={<div></div>} textSide={"right"}>
                Věříme, že soukromí a bezpečnost vašich dat by měla být na prvním místě. Nástroje jsou
                navrženy s ohledem na bezpečnost a všechna data jsou zpracována a uchovávána v souladu s nejmodernějšími
                standardy ochrany dat a osobních údajů. Můžete si být jisti, že vaše data jsou u nás v bezpečí.
            </TextElementPair>

            {/*Cards with the specific tools*/}

            
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