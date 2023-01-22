import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ModuleLandingPage, {TitleText} from "../components/ModuleLandingPage";
import Button, {Style} from "../components/Button";
import React, {useEffect, useRef} from "react";
import Typed from "typed.js";
import {useEventListener} from "@headlessui/react/dist/hooks/use-event-listener";

import PresIco from "./../public/assets/landing_icons/presentation.png";
import CodeIco from "./../public/assets/landing_icons/code.png";
import Text from "../public/assets/landing_icons/text.png";
import Wisdom from "../public/assets/landing_icons/wisdom.png";
import Writing from "../public/assets/landing_icons/writing.png";
import {Parallax, ParallaxProvider} from "react-scroll-parallax";
import Link from "next/link";
import { motion } from 'framer-motion';


// TODO: ADD _document.tsx or <Head> to every page.
const Home: NextPage = () => {
    const el = useRef(null);

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

    function Fractal(props: {title: string, iconSrc: string, speed: number, top?: number, left?: number, right?:  number, onClick?: () => void}) {
        return (
            <div onClick={props.onClick} className={`absolute ${props.top && `top-[${props.top}px]`} ${props.left && `left-[${props.left}px]`} ${props.right && `right-[${props.right}px]`}`}>

                <Parallax speed={props.speed}>
                    <motion.div
                        initial={{
                            opacity: 0,
                            transform: "translateY(150px)",
                        }}
                        animate={{
                            opacity: 0.8,
                            transform: "translateY(0px)",
                            transition: {
                                duration: 12 / props.speed
                            }
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                        whileHover={{
                            scale: 1.05,
                            opacity: 1,
                            rotate: Math.random() < 0.5 ? 5 : -5,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <div className={"flex flex-col items-center justify-center transition duration-300"}>
                            <img src={props.iconSrc} width={"72px"} />
                            <p>{props.title}</p>
                        </div>
                    </motion.div>
                </Parallax>
            </div>
        );
    }

    return (
        <ParallaxProvider>
            <div className={"relative"}>
                {/*TODO: On click scroll to its section.*/}
                <Fractal speed={4} title={"Tvorba prezentací"} iconSrc={PresIco.src} top={200} left={100}/>
                <Fractal speed={10} title={"Kódový asistent"} iconSrc={CodeIco.src} top={200} right={20}/>
                <Fractal speed={15} title={"Odpovědi"} iconSrc={Wisdom.src} top={350} right={300}/>
                <Fractal speed={8} title={"Úprava textu"} iconSrc={Text.src} top={400} left={300}/>

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
        </ParallaxProvider>
  );
}

export default Home