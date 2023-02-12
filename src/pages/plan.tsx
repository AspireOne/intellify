import {NextPage} from "next";
import Button, {Style} from "../components/Button";
import React, {useEffect, useState} from "react";
import {twMerge} from "tailwind-merge";
import {trpc} from "../utils/trpc";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Offer, OfferInfo, OfferType} from "../server/schemas/offers";
import {z} from "zod";

const Plan: NextPage = () => {
    const offers = trpc.offers.getOffers.useQuery();
    
    const [preSelectedOnetimeOffer, setPreSelectedOnetimeOffer] = useState<z.infer<typeof Offer> | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<z.infer<typeof Offer> | null>(null);

    useEffect(() => {
        if (!preSelectedOnetimeOffer && offers.data)
            setPreSelectedOnetimeOffer(offers.data.onetime.options[1]);
    }, [offers, offers?.data]);


    function handleClick(offer: z.infer<typeof Offer>) {
        setSelectedOffer(offer);
        // scroll to payment...
        document.getElementById("payment")?.scrollIntoView({behavior: "smooth"});
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
                        offer={offers.data?.planBasic}
                        onClick={handleClick}/>

                    <PlanCard
                        offer={offers.data?.planAdvanced}
                        bestOffer={true}
                        onClick={handleClick}/>

                    <PlanCard
                        offer={offers.data?.planCompany}
                        onClick={handleClick}/>
                </div>

                <Card className={"max-w-full mt-10 flex flex-col gap-8"}>
                    <div>
                        <CardTitle>{offers.data?.onetime.name ?? <Skeleton width={"5em"} height={"1.5em"}/>}</CardTitle>
                        <CardDescription>{offers.data?.onetime.description ?? <Skeleton count={2} width={"50%"}/>}</CardDescription>
                    </div>

                    <div className={"flex flex-row flex-wrap gap-4 sm:gap-2 mx-auto items-center sm:justify-start"}>
                        {
                            !offers.data?.onetime.options
                                ? <Skeleton count={4} inline={true} width={"90px"} className={"mx-1"} height={"60px"}/>
                                : offers.data.onetime.options.map((offer, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPreSelectedOnetimeOffer(offer)}
                                    className={`border border-1 border-gray-600 rounded-md py-2 px-6 duration-100 
                                    ${preSelectedOnetimeOffer === offer ? "bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    <div className={"text-md sm:text-lg font-bold"}>{formatNumber(offer.tokens)}</div>
                                    <div className={"text-gray-500 text-sm dark:text-gray-400"}>tokenů</div>
                                </button>
                            ))
                        }
                    </div>
                    <Price minitext={"/jednorázově"}>
                        {
                            !offers.data
                            ? <Skeleton inline={true} className={"mr-1"} width={"1.5em"}/>
                            : preSelectedOnetimeOffer?.price
                        }Kč
                    </Price>

                    <Button
                        loading={!offers?.data}
                        loadingText={"Načítání..."}
                        onClick={() => handleClick(preSelectedOnetimeOffer!)}
                        className={"p-4 font-bold max-w-md w-full mx-auto"}
                        style={Style.OUTLINE}>
                        Vybrat a pokračovat
                    </Button>
                </Card>
                <PaymentSection oneTime={offers.data?.onetime} offer={selectedOffer}/>
            </div>
        </section>
    );
}

const PaymentSection = (props: { offer?: z.infer<typeof Offer> | null, oneTime?: z.infer<typeof OfferInfo> }) => {
    let points: string[] = [];
    if (props.offer && props.oneTime) {
        points = [props.offer.tokens + " tokenů", ...(props.offer.points ?? props.oneTime.points!)]
    }

    return (
        <section className={"w-full"}>
            <h2 className="mt-12 mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Platba
            </h2>
            <div className={"space-y-5 lg:grid lg:grid-cols-2 lg:grid-rows-1 sm:gap-5 xl:gap-7 lg:space-y-0"}>
                <Card className={"mx-0 w-full text-left flex flex-row gap-5 justify-between"}>
                    <div id={"payment"}>
                        <div className={"mb-2"}>
                            <CardTitle className={"mb-0"}>Plán</CardTitle>
                            <CardDescription>
                                {
                                    props.offer && props.oneTime && (
                                    props.offer.type == OfferType.ONETIME
                                        ? props.oneTime.name
                                        : props.offer.name
                                    )
                                }
                            </CardDescription>
                        </div>
                        {props.offer && <p className={"font-semibold text-xl"}>{props.offer.price}Kč</p>}
                        {
                            props.offer &&
                            <p className={"text-gray-500 text-sm dark:text-gray-400"}>
                                {props.offer.type == OfferType.PLAN && "/měsíc"}
                            </p>
                        }
                    </div>
                    {points && <FormattedPoints points={points}/>}
                </Card>

                <Card className={"mx-0 w-full text-left"}>
                    <CardTitle>Platební metoda</CardTitle>
                </Card>
            </div>
        </section>
    )
}

const formatNumber = (num: number | null | undefined) => {
    if (!num) return num;
    // Example: if the number is 50000, format it to "50 000". If it is 100000, format it to "100 000". If it is 5000, format it to "5 000". If it is 1000000, format it to "1 000 000" etx.
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

const PlanCard = (props: {
                          bestOffer?: boolean,
                          onClick: (offer: z.infer<typeof Offer>) => void,
                          offer?: z.infer<typeof Offer> }) => {

    const tokenPoint = props.offer?.tokens + " tokenů";
    return (
        <Card className={"w-full"}>
            <div>
                <CardTitle>{props.offer?.name ?? <Skeleton/>}</CardTitle>
                <CardDescription>{props.offer?.description ?? <Skeleton/>}</CardDescription>
            </div>
            <div className="flex justify-center items-baseline my-8">
                <Price minitext={"/měsíc"}>{props.offer?.price ?? <Skeleton inline={true} className={"mr-1"} width={"1.5em"}/>}Kč</Price>
            </div>

            <ul role="list" className="mb-8 space-y-4 text-left">
                {
                    !props.offer?.points
                        ? <Skeleton count={4} className={"mx-1 w-full"}/>
                        : <FormattedPoints points={[tokenPoint, ...props.offer.points]}/>
                }
            </ul>
            <Button
                loading={!props.offer}
                loadingText={"Načítání..."}
                className={"p-4 font-bold"}
                onClick={() => props.onClick(props.offer!)}
                style={props.bestOffer ? Style.FILL : Style.OUTLINE}>
                Vybrat a pokračovat
            </Button>
        </Card>
    );
};

const FormattedPoints = (props: { points: string[] }) => {
    return (
        <div>
            {
                props.points.map((point, index) => (
                    <li key={index} className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"/>
                        </svg>
                        <span>{point}</span>
                    </li>
                ))
            }
        </div>
    );
}

// TODO: Abstract it ig...
const Card = (props: React.PropsWithChildren<{className?: string}>) => {
    return (
        <div className={twMerge(`flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 
        bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 
        xl:p-8 dark:bg-t-alternative-700 dark:text-white ${props.className}`)}>
            {props.children}
        </div>
    )
}

const CardTitle = (props: React.PropsWithChildren<{className?: string}>) => <h3 className={twMerge(`mb-3 text-2xl font-semibold ${props.className}`)}>{props.children}</h3>;
const CardDescription = (props: React.PropsWithChildren<{className?: string}>) => <p className={twMerge(`font-light text-gray-500 sm:text-lg dark:text-gray-400 ${props.className}`)}>{props.children}</p>

const Price = (props: React.PropsWithChildren<{minitext?: string}>) => {
    return (
        <div>
            <span className="mr-2 text-5xl font-extrabold">{props.children}</span>
            {props.minitext && <span className="text-gray-500 dark:text-gray-400">{props.minitext}</span>}
        </div>
    )
}

export default Plan;