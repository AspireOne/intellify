import {NextPage} from "next";
import Button, {Style} from "../components/Button";
import React, {useEffect, useState} from "react";
import {twMerge} from "tailwind-merge";
import {OneTimeOffers, Plans} from "../server/schemas/offers";
import {trpc} from "../utils/trpc";
import {useQuery} from "@tanstack/react-query";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Plan: NextPage = () => {
    const plans = trpc.offers.getPlans.useQuery();
    const oneTimeOffers = trpc.offers.getOneTimeOffers.useQuery();
    const [oneTimeOffer, setOneTimeOffer] = useState<OneTimeOffers | null>();

    useEffect(() => {
        if (!oneTimeOffer && oneTimeOffers.data)
            setOneTimeOffer(oneTimeOffers.data.options[1].type);
    }, [oneTimeOffers, oneTimeOffers?.data]);

    function handleClick(plan: Plans) {

    }

    return (
        <section className="">
            <div className="py-8 sm:px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        Navrženo pro jednorázové úkoly, i dlouhodobé projekty
                    </h2>
                    {/*TODO: Make this text shorter and add it to homepage instead..*/}
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        Doba jde dopředu, a umělá inteligence se stává nedílným nástrojem produktivity.
                        Open Tools posouvá hranice aplikací, a umožňuje vám tuto sílu využít
                    </p>
                    {/*
                     -
                        jak jednotlivci při jeho koníčcích, pracovních úkolech, nebo osobních projektech,
                        tak velkým týmům a firmám při budování produktů a služeb.*/}
                </div>

                <div className="space-y-8 lg:grid lg:grid-cols-3 lg:grid-rows-1 sm:gap-6 xl:gap-10 lg:space-y-0">
                    <PlanCard
                        loading={!plans.data}
                        title="Základní"
                        text="Všechno co potřebujete a ještě něco navíc."
                        price={plans.data?.basic.price}
                        onClick={() => handleClick(Plans.BASIC)}
                        points={[
                            <span>{formatNumber(plans.data?.basic.tokens) ?? <Skeleton inline={true} width={"2.5em"}/>} tokenů</span>,
                            'Žádné nastavování nebo skryté poplatky',
                            'Velikost týmu: 1 vývojář',
                            '24/7 Podpora',
                        ]}/>

                    <PlanCard
                        loading={!plans.data}
                        title="Pokročilý"
                        text="Nejlepší možnost pro osobní využití a pro vás další projekt."
                        price={plans.data?.advanced.price}
                        bestOffer={true}
                        onClick={() => handleClick(Plans.ADVANCED)}
                        points={[
                            <span>{formatNumber(plans.data?.advanced.tokens) ?? <Skeleton inline={true} width={"2.5em"}/>} tokenů</span>,
                            'Žádné nastavování nebo skryté poplatky',
                            'Velikost týmu: 1 vývojář',
                            '24/7 Podpora',
                        ]}/>

                    <PlanCard
                        loading={!plans.data}
                        title="Firma"
                        text="Nejlepší možnost pro větší týmy, firmy, a společnosti."
                        price={plans.data?.company.price}
                        onClick={() => handleClick(Plans.COMPANY)}
                        points={[
                            <span>{formatNumber(plans.data?.company.tokens) ?? <Skeleton inline={true} width={"2.5em"}/>} tokenů</span>,
                            'Žádné nastavování nebo skryté poplatky',
                            'Velikost týmu: 10+ vývojářů',
                            '24/7 Podpora',
                        ]}/>
                </div>

                <Card title={"Jednorázové"} description={"Tokeny můžete koupit taky jednorázově. Žádné opakované platby."}
                      className={"max-w-full mt-10 flex flex-col gap-8"}>

                    <div className={"flex flex-row flex-wrap gap-4 sm:gap-2 mx-auto items-center sm:justify-start"}>
                        {
                            !oneTimeOffers.data?.options
                                ? <Skeleton count={4} inline={true} width={"90px"} className={"mx-1"} height={"60px"}/>
                                : oneTimeOffers.data?.options.map((offer, index) => (
                                <button key={index} onClick={() => setOneTimeOffer(offer.type)} className={`
                                    border border-1 border-gray-600 rounded-md py-2 px-6
                                    duration-100 ${oneTimeOffer === offer.type ? "bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    <div className={"text-md sm:text-lg font-bold"}>{formatNumber(offer.tokens)}</div>
                                    <div className={"text-gray-500 text-sm dark:text-gray-400"}>tokenů</div>
                                </button>
                            ))
                        }
                    </div>
                    <Price minitext={"/jednorázově"}>
                        {
                            !oneTimeOffers.data
                            ? <Skeleton inline={true} className={"mr-1"} width={"1.5em"}/>
                            : oneTimeOffers.data.options.find(offer => offer.type === oneTimeOffer)?.price
                        }Kč
                    </Price>

                    <Button loading={!oneTimeOffers?.data} loadingText={"Načítání..."} className={"p-4 font-bold max-w-md w-full mx-auto"} style={Style.OUTLINE}>
                        Vybrat a pokračovat
                    </Button>
                </Card>
            </div>
        </section>
    );
}

const formatNumber = (num: number | null | undefined) => {
    if (!num) return num;
    // Example: if the number is 50000, format it to "50 000". If it is 100000, format it to "100 000". If it is 5000, format it to "5 000". If it is 1000000, format it to "1 000 000" etx.
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

const PlanCard = (props: { title: string, text: string, price?: number, points: React.ReactNode[], bestOffer?: boolean, onClick: () => void, loading?: boolean }) => {
    return (
        <Card title={props.title} description={props.text}>
            <div className="flex justify-center items-baseline my-8">
                <Price minitext={"/měsíc"}>{props.price ?? <Skeleton inline={true} className={"mr-1"} width={"1.5em"}/>}Kč</Price>
            </div>

            <ul role="list" className="mb-8 space-y-4 text-left">
                {props.points.map((point, index) => (
                    <li key={index} className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
            <Button loading={props.loading} loadingText={"Načítání..."} className={"p-4 font-bold"} style={props.bestOffer ? Style.FILL : Style.OUTLINE}>
                Vybrat a pokračovat
            </Button>
        </Card>
    );
};

const Card = (props: React.PropsWithChildren<{className?: string, title?: string, description?: string}>) => {
    return (
        <div className={twMerge(`
        flex flex-col p-6 
        mx-auto max-w-lg 
        text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 
        xl:p-8 dark:bg-t-alternative-700 dark:text-white ${props.className}`)}>
            <div>
                {props.title && <h3 className="mb-4 text-2xl font-semibold">{props.title}</h3>}
                {props.description && <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{props.description}</p>}
            </div>
            {props.children}
        </div>
    )
}

const Price = (props: React.PropsWithChildren<{minitext?: string}>) => {
    return (
        <div>
            <span className="mr-2 text-5xl font-extrabold">{props.children}</span>
            {props.minitext && <span className="text-gray-500 dark:text-gray-400">{props.minitext}</span>}
        </div>
    )
}

export default Plan;