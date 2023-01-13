import {NextPage} from "next";

import React, {PropsWithChildren} from "react";
import LandingPageProps from "../objects/LandingPageProps";
import Button, {Style} from "./Button";
import {ChevronDown, ChevronDownOutline, InformationCircle} from "react-ionicons";
import {useSession} from "next-auth/react";

/**
 * Renders an universal landing page for a module.
 * @param props text inside "[" and "]" will be highlighted.
 * @constructor
 */
const ModuleLandingPage = (props: {props: LandingPageProps}) => {
    const session = useSession();

    function handleActionButtClick() {
        if (session.status == "authenticated") {
            document?.getElementById(props.props.callToActionButton.targetElementId)
                ?.scrollIntoView({behavior: "smooth", block: "start"});
        } else {
            document?.getElementById("info-cards")
                ?.scrollIntoView({behavior: "smooth", block: "start"});
        }
    }

    const callToActionButtText = session.status == "authenticated"
        ? props.props.callToActionButton.titleWhenSigned
        : "Zjistit více";
    return (
        <div>
            <div className={"text-center pt-40 mx-auto px-2 max-w-[800px] h-screen"}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font"><TitleText>{props.props.title}</TitleText></h1>
                <p className="text-gray-400 text-xl mt-6 md:mx-32">{props.props.description}</p>
                <Button className={"mt-10 mr-5 text-md font-bold p-4 px-6"} onClick={handleActionButtClick}>{callToActionButtText}</Button> {/*TODO: If logged in, props.text. else "Vyzkoušet"*/}
                {session.status !== "authenticated" && <Button style={Style.OUTLINE} className={"mt-10 text-md font-bold p-4 px-6"}>Přihlásit se</Button>}
            </div>

            <div id="info-cards" className="flex flex-wrap items-stretch text-justify justify-center items-center">
                {
                    [props.props.card1, props.props.card2, props.props.card3].map((card, index) => {
                        return (
                            <div className="p-4 min-w-[350px] md:max-w-[390px]" key={index}>
                                {/*border border-purple-500 bg-t-blue-700 shadow-lg*/}
                                <div className="bg-t-blue-800 shadow-lg rounded-lg h-full p-5 pb-2">
                                    <h2 className="text-2xl text-gray-200 font-bold mb-2">{card.title}</h2>
                                    <p className="text-gray-400 text-md mb-4">{card.description}</p>
                                    {/*<button
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">Learn
                                        More
                                    </button>*/}
                                </div>
                            </div>
                        )
                    })
                }
                <div className={"p-6 shadow-lg rounded-lg my-5 mx-4 bg-t-blue-800 w-full max-w-[calc(390px_*_3)]"}>
                    <div className={"flex flex-row gap-2"}>
                        <InformationCircle color={"#fff"} height={"60%"}/>
                        <span className={"text-lg text-gray-200 mb-2 font-bold"}>Poznámka</span>
                    </div>
                    <p className={"text-gray-400"}>
                        Tento obsah je vygenerován pomocí A.I. Není chráněn autorským právem
                        a nespadá pod plagiarismus, můžete jej volně používat. Může obsahovat chyby,
                        chybné informace, nebo být nekompletní. Vždy si text zkontrolujte, než jej použijete.
                    </p>
                </div>
            </div>

            <div className={"pt-16 pb-8 my-32 mx-[-1.2rem]"}>
                <h1 className={"text-2xl md:text-3xl px-2 font-semibold text-center mx-auto max-w-[900px] text-gray-100"}>
                    {props.props.callToActionTitle}
                </h1>
                <ChevronDown width={"40px"} height={"auto"} color={"#fff"} cssClasses={"w-10 text-center mx-auto animate-pulse mt-10"} />
            </div>
        </div>
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