import {NextPage} from "next";
import PageTitle from "../components/PageTitle";
import Subtitle from "../components/Subtitle";
import {ArticleDiv} from "../components/article";
import {useEffect, useState} from "react";
import Confetti from 'react-confetti'
import {trpc} from "../lib/trpc";


const OrderResult: NextPage = () => {
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
                </div>
            </ArticleDiv>
        </div>
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