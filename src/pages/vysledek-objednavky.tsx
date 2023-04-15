import {NextPage} from "next";
import PageTitle from "../components/PageTitle";
import Subtitle from "../components/Subtitle";
import {ArticleDiv} from "../components/article";
import {useEffect, useState} from "react";
import Confetti from "react-confetti";
import {trpc} from "../lib/trpc";
import {Offer, OfferType} from "../server/schemas/offers";
import {z} from "zod";
import Card from "../components/Card";
import Utils from "../lib/utils";
import Skeleton from "react-loading-skeleton";
import Title from "../components/Title";
import {twMerge} from "tailwind-merge";
import PageHead from "../components/PageHead";


const OrderResult: NextPage = () => {
    const query = trpc.offers.getOfferFromSession.useMutation();

    useEffect(() => {
        if (typeof window === undefined) return;

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        query.mutate({session: params.session_id});
    }, []);

    /*const offer = trpc.offers.*/
    /*const [width, setWidth] = useState<null | number>(null);
    const [height, setHeight] = useState<null | number>(null);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);;
    }, []);*/

    const {width, height} = useWindowSize();

    useEffect(() => {
        (document.getElementById("music")! as HTMLAudioElement).play().catch((error) => {
            document.addEventListener('click', () => {
                (document.getElementById("music") as HTMLAudioElement)!.play();
            }, {once: true})
        });
    }, []);

    return (
        <div className={"overflow-hidden relative"}>
            <PageHead title={"Děkujeme!"} description={"Výsledek objednávky."} />
            <Confetti
                width={width}
                height={height + 10}
                /*recycle={false}*/
            />
            {/*Play mp3*/}
            <audio id={"music"} autoPlay={true} src="/assets/prock.mp3" controls={false}  />
            <ArticleDiv className="flex items-center justify-center h-screen">
                <div>
                    <PageTitle className={"title-highlighted mt-0"}>Děkujeme!</PageTitle>
                    <Subtitle className={"text-center"}>
                        Detaily vám byly odeslány na e-mail. V případě dotazů nebo problémů nás neváhejte kontaktovat.
                    </Subtitle>
                    <OfferDetails className={"m-6"} offer={query.data?.offer} orderId={query.data?.orderId}/>
                </div>
            </ArticleDiv>
        </div>
    );
};

function OfferDetails(props: {offer?: z.infer<typeof Offer>, orderId?: number, className?: string}) {
    // A card with the details of the order.
    return (
        <Card className={twMerge(`flex flex-col gap-4 ${props.className}`)}>
            <div>
                <Title size={2}>{props.offer?.fullName ?? <Skeleton height={"32px"} width={"250px"}/>}</Title>
                <p>{props.offer?.description ?? <Skeleton className={"max-w-[420px]"}/>}</p>
            </div>
            <ul className="list-disc list-inside">
                {!props.offer?.points && <Skeleton count={3} width={"250px"}/>}
                {
                    props.offer?.points.map((point, index) => (
                        <li key={index} className="">{point}</li>
                    ))}
            </ul>
            <div>
                {!props.offer && <Skeleton width={"70px"} count={3}/>}
                {
                    props.offer &&
                    <>
                        <p><b>Cena</b>: {props.offer.price} Kč</p>
                        <p><b>{props.offer.type == OfferType.ONETIME ? "Zakoupeno slov" : "Maximum slov"}</b>: {Utils.tokensToWords(props.offer?.tokens)}</p>
                        <p><b>{"Číslo objednávky"}</b>: {props.orderId}</p>
                    </>
                }
            </div>
        </Card>
    );
};

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth - 20,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default OrderResult;