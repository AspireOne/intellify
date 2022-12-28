import {NextPage} from "next";
import ModuleLandingPage from "../components/ModuleLandingPage";
import LandingPageProps from "../objects/LandingPageProps";
import Button from "../components/Button";
import React from "react";

const landingPageProps: LandingPageProps = {
    title: "Vytvářejte prezentace s pomocí [A.I.]",
    description: "",
    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožní vytvářet rozsáhlé prezentace během vteřin. Je navržen tak, aby proces vytváření profesionálních, vizuálně krásných prezentací byl rychlý a snadný. Díky široké škále nastavitelných parametrů a funkcí máte možnost vytvořit prezentaci, která skutečně odráží vaše sdělení."
    },
    card2: {
        title: "Co to umí?",
        description: "Snadno vytvořte obsah a design prezentace díky možnosti přizpůsobit si parametry jako počet slidů, počet odrážek, úvodní text, obrázky, atd. Ke každému bodu si můžete nechat vygenerovat popis. Všechny části prezentace můžete libovolně upravovat."
    },
    card3: {
        title: "Proč jej použít?",
        description: "Ušetříte si čas a námahu a zajistíte, že vaše prezentace bude vizuálně atraktivní a profesionální. Ať už jste majitel firmy, který chce prezentovat své výrobky nebo služby, student přednášející prezentaci ve třídě nebo pracovník na volné noze, který se snaží představit potenciálnímu klientovi, náš nástroj vám pomůže."
    }
};

const StoryTeller: NextPage = () => {
    return (
        <ModuleLandingPage props={landingPageProps}></ModuleLandingPage>
    );
};
export default StoryTeller;