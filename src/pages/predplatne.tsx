import {GetServerSidePropsContext, GetStaticPropsContext, InferGetServerSidePropsType, NextPage} from "next";
import Button, {Style} from "../components/Button";
import React, {useEffect, useState} from "react";
import {twMerge} from "tailwind-merge";
import {trpc} from "../utils/trpc";
import Skeleton from 'react-loading-skeleton';
import {Offer, OfferType} from "../server/schemas/offers";
import {z} from "zod";
import getStripe from "../lib/get-stripe";
import {Stripe} from "stripe";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {paths} from "../lib/constants";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";
import {LockClosed} from "react-ionicons";
import Subtitle from "../components/Subtitle";
import PageHeaderDiv from "../components/PageHeaderDiv";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "../server/routers/_app";
import {createContext, createContextInner} from "../server/context";

// This function gets called at build time
export async function getServerSideProps(
    context: GetServerSidePropsContext<{}>,
) {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(),
    });
    await ssg.offers.getOffers.prefetch();
    // Make sure to return { props: { trpcState: ssg.dehydrate() } }
    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
    };
}

const Subscription = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const offers = trpc.offers.getOffers.useQuery();
    const user = trpc.user.getUser.useQuery();
    const session = useSession();
    const router = useRouter();

    const [preSelectedOnetimeOffer, setPreSelectedOnetimeOffer] = useState<z.infer<typeof Offer> | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<z.infer<typeof Offer> | null>(null);

    useEffect(() => {
        if (!preSelectedOnetimeOffer && offers.data)
            setPreSelectedOnetimeOffer(offers.data.onetimeTwo);
    }, [offers, offers?.data]);


    function handleClick(offer: z.infer<typeof Offer>) {
        if (!session.data?.user) {
            router.push(paths.sign);
            return;
        }
        setSelectedOffer(offer);
        document.getElementById("payment")?.scrollIntoView({behavior: "smooth"});
    }

    const onetimeOffers = Object.values(offers.data ?? {})
        .filter((offer) => offer.type === OfferType.ONETIME);

    return (
        <section>
            <div className="mx-auto max-w-screen-xl">
                <PageHeaderDiv>
                    <PageTitle>
                        Navrženo pro jednorázové úkoly, i dlouhodobé projekty
                    </PageTitle>
                    <Subtitle className="sm:text-xl">
                        Doba jde dopředu, a umělá inteligence se stává nedílným nástrojem produktivity.
                        Open Tools posouvá hranice aplikací, a umožňuje vám tuto sílu využít.
                    </Subtitle>
                    {/*
                     -
                        jak jednotlivci při jeho koníčcích, pracovních úkolech, nebo osobních projektech,
                        tak velkým týmům a firmám při budování produktů a služeb.*/}
                </PageHeaderDiv>

                <div className="space-y-8 lg:grid lg:grid-cols-3 lg:grid-rows-1 sm:gap-6 xl:gap-10 lg:space-y-0">
                    <PlanCard
                        offer={offers.data?.planBasic}
                        currentOffer={(user.data && offers.data) && user.data.subscription?.id === offers.data.planBasic.id}
                        onClick={handleClick}/>

                    <PlanCard
                        offer={offers.data?.planAdvanced}
                        bestOffer={true}
                        currentOffer={(user.data && offers.data) && user.data.subscription?.id === offers.data.planAdvanced.id}
                        onClick={handleClick}/>

                    <PlanCard
                        offer={offers.data?.planCompany}
                        currentOffer={(user.data && offers.data) && user.data.subscription?.id === offers.data.planCompany.id}
                        onClick={handleClick}/>
                </div>

                <CustomCard className={"max-w-full mt-10 flex flex-col gap-8"}>
                    <div>
                        <CardTitle>
                            {offers.data?.onetimeOne.name ?? <Skeleton width={"5em"} height={"1.5em"}/>}
                        </CardTitle>
                        <CardDescription>
                            {offers.data?.onetimeOne.description ?? <Skeleton count={2} width={"50%"}/>}
                        </CardDescription>
                    </div>

                    <div className={"flex flex-row flex-wrap gap-4 sm:gap-2 mx-auto items-center sm:justify-start"}>
                        {
                            !offers.data
                                ? <Skeleton count={4} inline={true} width={"90px"} className={"mx-1"} height={"60px"}/>
                                : onetimeOffers.map((offer, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPreSelectedOnetimeOffer(offer)}
                                    className={`border border-1 border-gray-600 rounded-md py-2 px-6 duration-100 
                                    ${preSelectedOnetimeOffer === offer ? "bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    <div className={"text-md sm:text-lg font-bold"}>~{tokensToWords(offer.tokens)}</div>
                                    <div className={"text-gray-500 text-sm dark:text-gray-400"}>slov</div>
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
                </CustomCard>
                <PaymentSection offer={selectedOffer}/>
            </div>
        </section>
    );
}

const PaymentSection = (props: { offer?: z.infer<typeof Offer> | null }) => {
    if (!props.offer) return <></>;
    const sessionMutation = trpc.offers.getSession.useMutation();
    let points: string[] = [];
    if (props.offer) {
        points = ["Až ~" + tokensToWords(props.offer.tokens) + " slov", ...(props.offer.points)];
    }

    return (
        <section className={"w-full"}>
            <h2 className="mt-12 mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Platba
            </h2>
            <div className={"space-y-5 lg:grid lg:grid-cols-2 lg:grid-rows-1 sm:gap-5 xl:gap-7 lg:space-y-0"}>
                <CustomCard id={"payment"} className={"mx-0 w-full text-left flex flex-col gap-4"}>
                    <div className={"flex flex-row gap-5 justify-between"}>
                        <div>
                            <div className={"mb-2"}>
                                <CardTitle className={"mb-0"}>{props.offer.type == OfferType.PLAN ? "Předplatné" : "Jednorázově"}</CardTitle>
                                <CardDescription>
                                    {props.offer.name}
                                </CardDescription>
                            </div>
                            {<p className={"font-semibold text-xl"}>{props.offer.price}Kč</p>}
                            {
                                <p className={"text-gray-500 text-sm dark:text-gray-400"}>
                                    {props.offer.type == OfferType.PLAN && "/měsíc"}
                                </p>
                            }
                        </div>
                        {points && <FormattedPoints points={points}/>}
                    </div>
                    <Button className={"flex flex-row justify-center items-center gap-2 text-md"} onClick={async () => {
                        if (!props.offer?.id) return;

                        const checkoutSession: Stripe.Checkout.Session = await sessionMutation.mutateAsync({
                            offerId: props.offer?.id,
                        });

                        const stripe = await getStripe();
                        const { error } = await stripe!.redirectToCheckout({
                            sessionId: checkoutSession.id,
                        });
                        console.warn(error.message);
                    }}>

                        <LockClosed color={"#fff"}/> Zaplatit
                    </Button>
                </CustomCard>

                {/*<CustomCard className={"mx-0 w-full text-left"}>
                    <CardTitle>Platební metoda</CardTitle>
                    <Button className={"flex flex-row justify-center items-center gap-2 text-md"} onClick={async () => {
                        if (!props.offer?.id) return;

                        const checkoutSession: Stripe.Checkout.Session = await sessionMutation.mutateAsync({
                            offerId: props.offer?.id,
                        });

                        const stripe = await getStripe();
                        const { error } = await stripe!.redirectToCheckout({
                            sessionId: checkoutSession.id,
                        });
                        console.warn(error.message);
                    }}>

                        <LockClosed color={"#fff"}/> Zaplatit
                    </Button>
                </CustomCard>*/}
            </div>
        </section>
    )
}

const tokensToWords = (tokens: number | null | undefined) => {
    if (!tokens) return tokens;

    const words = Math.round(tokens * 0.75);
    const wordsRounded = Math.round(words / 1000) * 1000;
    // Formatted so that 50000 = 50 000.
    return wordsRounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

const PlanCard = (props: {
    bestOffer?: boolean,
    currentOffer?: boolean,
    onClick: (offer: z.infer<typeof Offer>) => void,
    offer?: z.infer<typeof Offer> }) => {

    const tokenPoint = "Až ~" + tokensToWords(props.offer?.tokens) + " slov";
    return (
        <div>
            <CustomCard className={`w-full ${props.currentOffer && "border-blue-500 border-2"}`}>
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
                {
                    !props.currentOffer &&
                    <Button
                        loading={!props.offer}
                        loadingText={"Načítání..."}
                        className={"p-4 font-bold"}
                        onClick={() => props.onClick(props.offer!)}
                        style={props.bestOffer ? Style.FILL : Style.OUTLINE}>
                        Vybrat a pokračovat
                    </Button>
                }
                {
                    props.currentOffer &&
                    <p className={"font-bold text-lg text-center my-3 text-blue-500"}>
                        Současné předplatné
                    </p>
                }
            </CustomCard>
        </div>
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

const CustomCard = (props: React.PropsWithChildren<{className?: string, id?: string}>) => {
    return (
        <Card id={props.id} border={true} className={twMerge(`flex flex-col mx-auto max-w-lg text-center 
        rounded-lg xl:p-8 ${props.className}`)}>
            {props.children}
        </Card>
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

export default Subscription;