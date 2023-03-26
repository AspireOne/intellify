import type {NextPage} from 'next'
import React, {useEffect, useRef} from "react";
import Typed from "typed.js";

import {motion} from 'framer-motion';
import {trpc} from "../lib/trpc";
import {useSession} from "next-auth/react";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import PageHeaderDiv from "../components/PageHeaderDiv";
import PageTitle from "../components/PageTitle";


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);
    const session = useSession();
    console.log(session.data?.user.id);

    useEffect(() => {
        // If it slows down the website, stop typing when it is not visible.
        const typed = new Typed(el.current || "", {
            strings: ["Úpravu textu.", "Obsah prezentací.", "Programování."], // Strings to display
            // Speed settings, try diffrent values untill you get good results
            startDelay: 500,
            typeSpeed: 75,
            backSpeed: 50,
            backDelay: 800,
            loop: true,
            cursorChar: ""
        });

        return () => typed.destroy();
    }, []);

    return (
        <div>
            <div className={"text-center mt-44 mx-auto px-2 mb-40 max-w-[800px] h-full"}>
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    transition={{duration: 0.6}}
                    animate={{opacity: 1, y: 0}}
                >
                    <div className={"flex flex-col gap-10 text-center justify-center"}>
                        <Title className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font m-0">
                            Nejlepší A.I. Nástroj na
                            <div className={"my-4"}/>
                            <span className={"title-highlighted"} ref={el}></span>
                            <img className={"transform -translate-y-3 inline animate-pulse duration-100"} src={"https://global-uploads.webflow.com/627a1044a798e6627445c8d1/62b15f383fdee46ecf39db49_line.svg"}></img>
                        </Title>
                        <Subtitle className={"mx-12 text-2xl leading-8"}>
                            Vytvářejte obsah a dokončujte projekty 10X rychleji,
                            <br/>
                            nebo si nechte usnadnit svou každodenní práci.
                        </Subtitle>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Home