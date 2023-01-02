import {NextPage} from "next";

import React from "react";
import LandingPageProps from "../objects/LandingPageProps";
import Button, {Style} from "./Button";
import {ChevronDown, ChevronDownOutline} from "react-ionicons";

/**
 * Renders an universal landing page for a module.
 * @param props text inside "[" and "]" will be highlighted.
 * @constructor
 */
const ModuleLandingPage = (props: {props: LandingPageProps}) => {
    function handleActionButtonClick() {
        document?.getElementById(props.props.callToActionButton.targetElementId)?.scrollIntoView({behavior: "smooth", block: "start"});
    }
    return (
        <div>
            <div className={"text-center mt-32 mx-auto px-2 mb-40 max-w-[800px]"}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font"><TitleText text={props.props.title}/></h1>
                <p className="text-gray-400 text-xl mt-6 md:mx-32">{props.props.description}</p>
                <Button className={"mt-10 mr-8 text-lg"}  onClick={handleActionButtonClick}>Vyzkoušet</Button> {/*TODO: If logged in, props.text. else "Vyzkoušet"*/}
                <Button style={Style.OUTLINE} className={"mt-10 text-lg"}>Přihlásit se</Button>
            </div>

            <div className="flex flex-wrap items-stretch text-justify justify-center items-center">
                {
                    [props.props.card1, props.props.card2, props.props.card3].map((card, index) => {
                        return (
                            <div className="py-4 px-0 sm:px-4 min-w-[350px] max-w-[390px]" key={index}>
                                {/*border border-purple-500 bg-t-blue-700 shadow-lg*/}
                                <div className="bg-t-blue-700 shadow-lg rounded-lg h-full p-5 pb-2">
                                    <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                                    <p className="text-gray-500 text-lg mb-4">{card.description}</p>
                                    {/*<button
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">Learn
                                        More
                                    </button>*/}
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className={"pt-20 pb-16 m-10 mx-[-1.2rem] bg-t-blue-800"}>
                <h1 className={"text-2xl md:text-3xl px-2 font-semibold text-center mx-auto max-w-[900px] text-gray-100"}>
                    {props.props.callToActionTitle}
                </h1>
                <ChevronDown width={"40px"} height={"auto"} color={"#fff"} cssClasses={"w-10 text-center mx-auto animate-pulse mt-10"} />
            </div>
            {/*TODO: ADD "tak na co čekáte? zkuse to hned..." atd.*/}
        </div>
    );
}

/**
 * Takes text and returns it as an element. Text inside "[" and "]" will be highlighted.
 * @param props The text to make the title from. Text inside "[" and "]" will be highlighted.
 * @constructor
 */
function TitleText(props: {text: string}): React.ReactElement {
    // Split the text into parts.
    const parts = props.text.split(/(\[.*?\])/);
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