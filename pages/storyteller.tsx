import {NextPage} from "next";
import ModuleLandingPage from "../components/ModuleLandingPage";
import LandingPageProps from "../objects/LandingPageProps";
import Button from "../components/Button";
import React from "react";

const landingPageProps: LandingPageProps = {
    title: "Vytvářejte příběhy s pomocí [A.I.]",
    description: "Profesionálně vyprávěné a přizpůsobitelné příběhy pro různé účely, od osobních projektů po komerční účely, v řádu vteřin.",
    callToActionTitle: "Vyzkoušejte si hned teď, jaký rozdíl může náš nástroj udělat ve vašem příštím příběhu.",
    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožní vytvářet příběhy během vteřin. Je navržen tak, aby proces vytváření profesionálně vyprávěných a přizpůsobitelných příběhů byl rychlý a snadný. Díky široké škále nastavitelných parametrů a funkcí máte možnost vytvořit příběh, který skutečně odráží váš příběh."
    },
    card2: {
        title: "Co to umí?",
        description: "Přizpůsobte si parametry jako délku příběhu, žánr, nebo úvodní scénu, nechte si vygenerovat klíčová slova nebo libovolně pomocí psaného textu určete specifika příběhu, nebo vytvořte příběh na fiktivní téma. Zbytek nechte na našem A.I.!"
    },
    card3: {
        title: "Proč jej použít?",
        description: "Ušetříte si čas a úsilí a zajistíte, že váš příběh bude profesionálně vyprávěný a zajímavý. Ať už jste spisovatel, který hledá inspiraci nebo podporu při psaní, nebo podnikatel, který chce vyprávět příběh svého produktu nebo služby, náš nástroj vám pomůže."
    },
    callToActionButton: {
        titleWhenSigned: "sdsds",
        targetElementId: "s"
    }
};

const StoryTeller: NextPage = () => {
    return (
        <ModuleLandingPage props={landingPageProps}></ModuleLandingPage>
    );
};
export default StoryTeller;