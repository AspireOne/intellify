import {NextPage} from "next";

import React, {PropsWithChildren, useEffect} from "react";
import LandingPageProps from "../lib/landingPageProps";
import Button, {Style} from "./Button";
import {ChevronDown, InformationCircle} from "react-ionicons";
import {useSession} from "next-auth/react";
import { motion } from "framer-motion";
import {Parallax, ParallaxProvider} from "react-scroll-parallax";
import {Router, useRouter} from "next/router";
import {paths} from "../lib/constants";

/**
 * Renders an universal landing page for a module.
 * @param props text inside "[" and "]" will be highlighted.
 * @constructor
 */
const ModuleLandingPage = (props: {props: LandingPageProps}) => {
    const session = useSession();
    const router = useRouter();
    // TODO: If the auth check is slow, save it to localstorage and use it as fallback until the real one is loaded.
    // That way the probability of localstorage being right is like 98%.

    // When session becomes authenticated, redirect to the module.
    useEffect(() => {
        if (session.status == "authenticated") {
            document?.getElementById(props.props.callToActionButtonSigned.targetElementId)
                ?.scrollIntoView({behavior: "auto", block: "nearest"});
        }
    }, [session.status]);

    function handleActionButtClick() {
        if (session.status == "authenticated") {
            document?.getElementById(props.props.callToActionButtonSigned.targetElementId)
                ?.scrollIntoView({behavior: "smooth", block: "nearest"});
        } else {
            // Scroll to 600px from the top of the page.
            window.scrollTo({top: 620, behavior: "smooth"});

            /*document?.getElementById("info-cards")
                ?.scrollIntoView({behavior: "smooth", block: "start"});*/
        }
    }

    const callToActionButtText = session.status == "authenticated"
        ? props.props.callToActionButtonSigned.title
        : "Zjistit více";
    return (
        <ParallaxProvider>
            <div className={"h-screen relative"}>
                <div className={"absolute top-10 right-10 h-32 w-32 rounded-full bg-gradient-radial from-[rgba(255,255,255,0.3)]"}>
                </div>

                <div className={"-mt-10 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center w-full max-w-[900px]"}>
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        transition={{duration: 0.6}}
                        animate={{opacity: 1, y: 0}}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl title-font">
                            <TitleText>{props.props.title}</TitleText>
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        transition={{duration: 0.6, delay: 0.2}}
                        animate={{opacity: 1, y: 0}}
                    >
                    <p className="text-gray-400 text-xl mt-6 md:mx-32">
                        {props.props.description}
                    </p>
                    </motion.div>
                    <Parallax speed={-5}>
                        <Button
                            className={"mt-10 mr-5 text-md font-bold p-4 px-6"}
                            onClick={handleActionButtClick}>{callToActionButtText}
                        </Button>
                        {
                            session.status !== "authenticated" &&
                            <Button
                                style={Style.OUTLINE}
                                onClick={() => router.push(paths.sign)}
                                className={"mt-10 text-md font-bold p-4 px-6"}>
                                Přihlásit se
                            </Button>
                        }
                    </Parallax>
                </div>
            </div>

            <Parallax speed={10} id="info-cards" className="flex flex-row grow gap-6 2xl:gap-12 flex-wrap items-stretch text-justify justify-center items-center">
                {
                    [props.props.card1, props.props.card2, props.props.card3].map((card, index) => {
                        return (
                            <div className="min-w-[350px] md:max-w-[360px] 2xl:max-w-[400px]" key={index}>
                                {/*border border-purple-500 bg-t-blue-700 shadow-lg*/}
                                <div className="bg-t-blue-700 shadow-lg rounded-lg h-full p-5">
                                    <h2 className="text-2xl text-gray-200 font-bold mb-2">{card.title}</h2>
                                    <p className="text-gray-400 text-md 2xl:text-lg">{card.description}</p>
                                    {/*<button
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue alwaysActive:bg-blue-800">Learn
                                        More
                                    </button>*/}
                                </div>
                            </div>
                        )
                    })
                }

                <div className={"min-w-[350px] md:max-w-[360px] lg:min-w-0 lg:max-w-full"}>
                    <div className={"bg-t-blue-700 shadow-lg rounded-lg h-full p-5 lg:p-6 lg:max-w-[calc(420px_*_3)]"}>
                        <div className={"flex flex-row gap-2"}>
                            <InformationCircle color={"#fff"} height={"60%"}/>
                            <span className={"text-lg text-gray-200 mb-2 font-bold"}>Poznámka</span>
                        </div>
                        <p className={"text-gray-400 2xl:text-lg"}>
                            Tento obsah je vygenerován pomocí A.I. Není chráněn autorským právem
                            a nespadá pod plagiarismus, můžete jej volně používat. Může obsahovat chyby,
                            chybné informace, nebo být nekompletní. Vždy si text zkontrolujte, než jej použijete.
                        </p>
                    </div>
                </div>
            </Parallax>

            <div className={"pt-16 pb-8 my-32"}>
                {
                    session.status != "authenticated" &&
                    <h1 className={"text-2xl md:text-3xl px-1 font-semibold text-center mx-auto max-w-[900px] text-gray-100"}>
                        {props.props.callToActionTextUnsigned}
                    </h1>
                }
                <ChevronDown width={"40px"} height={"auto"} color={"#fff"} cssClasses={"w-10 text-center mx-auto animate-pulse mt-10"} />
            </div>
        </ParallaxProvider>
    );
}

/**
 * Takes in a text and transforms it into a standard title format. All text inside "[]" will be highlighted.
 * @param props The title text. Put text into [] to highlight it.
 * @constructor
 */
export function TitleText(props: PropsWithChildren<{children: string}>): React.ReactElement {
    // Split the text into parts.
    const parts: string[] = props.children.split(/(\[.*?\])/);
    parts.push("[]"); // Add a dummy element to the end to make the loop work.
    // Create an array of elements.
    const elements: React.ReactElement[] = [];
    // Iterate over the parts.
    for (let i = 0; i < parts.length; i++) {
        // Get the current part.
        const part = parts[i];
        // Check if the part is a highlighted part.
        if (part.startsWith("[") && part.endsWith("]")) {
            // Get the text inside the brackets.
            const highlighted = part.substring(1, part.length - 1);
            // Get the text before the brackets.
            const before = parts[i - 1];
            // Get the text after the brackets.
            const after = parts[i + 1];
            // Create an element.
            elements.push(<span key={i}>{before}<span className={"title-highlighted"}>{highlighted}</span></span>);
        }
    }
    // Return the elements.
    return <>{elements}</>;
}

export default ModuleLandingPage