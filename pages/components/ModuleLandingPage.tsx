import {NextPage} from "next";

import React from "react";
import LandingPageParams from "../objects/LandingPageParams";

const ModuleLandingPage = (props: {props: LandingPageParams}) => {
    return (
        <div>
            <div className={"text-center mt-32 mx-auto px-2 mb-32 max-w-[800px]"}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font">Vytvářejte prezentace s pomocí <span className={"title-highlighted"}>A.I.</span></h1>
                <p className="text-gray-400 text-xl mt-6 lg:mx-32">Profesionální a přizpůsobitelná prezentace do práce, do školy i pro osobní projekty v řádu vteřin.</p>
            </div>

            <div className="flex flex-wrap items-stretch text-justify justify-center items-center">
                {
                    [props.props.card1, props.props.card2, props.props.card3].map((card, index) => {
                        return (
                            <div className="w-1/3 lg:p-5 border-red-500 min-w-[380px] max-w-[440px]" key={index}>
                                {/*border border-gray-700 bg-t-blue-700 shadow-lg*/}
                                <div className=" rounded-lg h-full border-purple-500 pb-8 lg:p-4 min-w-[350px]">
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
        </div>
    );
}

export default ModuleLandingPage