import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ModuleLandingPage, {TitleText} from "../components/ModuleLandingPage";
import Button, {Style} from "../components/Button";
import React, {useEffect, useRef} from "react";
import Typed from "typed.js";
import {useEventListener} from "@headlessui/react/dist/hooks/use-event-listener";

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


    return (
      <div className={"text-center mt-32 mx-auto px-2 mb-40 max-w-[800px]"}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl title-font">Nejlepší A.I. Nástroj na<br/>
              <span className={"title-highlighted"} ref={el}></span>
          </h1>
      </div>
  );
}

export default Home