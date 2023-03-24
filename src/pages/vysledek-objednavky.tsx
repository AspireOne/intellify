import {NextPage} from "next";
import PageTitle from "../components/PageTitle";
import Subtitle from "../components/Subtitle";
import {ArticleDiv} from "../components/article";
import {useEffect, useState} from "react";
import Confetti from 'react-confetti'
import {trpc} from "../lib/trpc";
import {Offer, OfferId} from "../server/schemas/offers";
import {useSearchParams} from "react-router-dom";
import {z} from "zod";
import Card from "../components/Card";
import Utils from "../lib/utils";


const OrderResult: NextPage = () => {
    const query = trpc.offers.getOfferFromSession.useMutation();

    useEffect(() => {
        if (typeof window === undefined) return;

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (!params.session_id) {
            // TODO redirect
        }
        query.mutate({session: params.session_id});

        console.log("session id: " + params.session_id);
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
        <div>
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
                    {query.data ? <OfferDetails className={"m-4"} offer={query.data}/> : null}
                </div>
            </ArticleDiv>
        </div>
    );
};

function OfferDetails(props: {offer: z.infer<typeof Offer>, className?: string}) {
    // A card with the details of the order.
    return (
        <Card className={props.className}>
            <h2 className="text-lg font-bold mb-4">{props.offer.name}</h2>
            <p className="mb-4">{props.offer.description}</p>
            <ul className="list-disc list-inside mb-4">
                {props.offer.points.map((point, index) => (
                    <li key={index} className="">{point}</li>
                ))}
            </ul>
            <p className="mb-4">Cena: {props.offer.price} Kč</p>
            <p className="mb-4">Maximum slov: {Utils.tokensToWords(props.offer.tokens)}</p>
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