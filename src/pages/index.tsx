import type { NextPage } from 'next'
import React, {useEffect, useRef} from "react";
import Typed from "typed.js";

import { motion } from 'framer-motion';
import {trpc} from "../utils/trpc";


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);
    trpc.offers.testPay.useQuery();

    useEffect(() => {
        // TODO: If it slows down the website, stop typing when it is not visible.
        const typed = new Typed(el.current || "", {
            strings: ["Úpravu textu.", "Obsah prezentací.", "Programování."], // Strings to display
            // Speed settings, try diffrent values untill you get good results
            startDelay: 500,
            typeSpeed: 75,
            backSpeed: 50,
            backDelay: 800,
            loop: true,
        });

        return () => typed.destroy();
    }, []);

    return (
        <div className={"relative"}>
            <div className={"text-center mt-32 mx-auto px-2 mb-40 max-w-[800px] h-[200vh]"}>
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    transition={{duration: 0.6}}
                    animate={{opacity: 1, y: 0}}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font">Nejlepší A.I. Nástroj na<br/>
                        <span className={"title-highlighted"} ref={el}></span>
                    </h1>
                </motion.div>
            </div>
        </div>
    );
}

export default Home