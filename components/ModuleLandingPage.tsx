import {NextPage} from "next";

import React from "react";
import LandingPageProps from "../objects/LandingPageProps";

/**
 * Renders an universal landing page for a module.
 * @param props text inside "[" and "]" will be highlighted.
 * @constructor
 */
const ModuleLandingPage = (props: {props: LandingPageProps}) => {
    return (
        <div>
            <div className={"text-center mt-32 mx-auto px-2 mb-40 max-w-[800px]"}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font"><TitleText text={props.props.title}/></h1>
                <p className="text-gray-400 text-xl mt-6 md:mx-32">{props.props.description}</p>
            </div>

            <div className="flex flex-wrap items-stretch text-justify justify-center items-center">
                {
                    [props.props.card1, props.props.card2, props.props.card3].map((card, index) => {
                        return (
                            <div className="w-1/3 lg:p-5 lg:py-1 min-w-[360px] max-w-[440px]" key={index}>
                                {/*border border-purple-500 bg-t-blue-700 shadow-lg*/}
                                <div className=" rounded-lg h-full p-4 min-w-[350px]">
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
    // Check if text contains "[" and "]", and that "[" is before "]".
    if (!props.text.includes("[") || !props.text.includes("]") || props.text.indexOf("[") > props.text.indexOf("]")) {
        return (<span>{props.text}</span>);
    }

    // Get all the props.text before "[".
    const before = props.text.substring(0, props.text.indexOf("["));
    // Get all the props.text between "[" and "]".
    const highlighted = props.text.substring(props.text.indexOf("[") + 1, props.text.indexOf("]"));
    // Get all the props.text after "]".
    const after = props.text.substring(props.text.indexOf("]") + 1, props.text.length);

    return (<span>{before}<span className={"title-highlighted"}>{highlighted}</span>{after}</span>)
}

export default ModuleLandingPage