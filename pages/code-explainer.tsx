import {NextPage} from "next";
import ModuleLandingPage from "../components/ModuleLandingPage";
import LandingPageProps from "../objects/LandingPageProps";
import Button from "../components/Button";
import React from "react";

const landingPageProps: LandingPageProps = {
    title: "Nechte si vygenerovat [vysvětlení kódu]",

    description: "Překonávejte překážky při pochopení kódu, nebo si nechte pomoct při vysvětlování kódu ostatním.",

    callToActionTitle: "Vyzkoušejte náš nástroj hned teď a zjistěte, jak vám může pomoci pochopit kód.",

    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožní vkládat kód a získat jeho vysvětlení od našeho A.I. Je ideální pro vývojáře, kteří se chtějí rychle a snadno seznámit s novým kódem nebo kódem, se kterým mají potíže. Můžete také použít nástroj jako pomůcku při vysvětlování kódu ostatním."
    },

    card2: {
        title: "Co to umí?",
        description: "Naše A.I. dokáže vysvětlit jednotlivé části vašeho kódu a poskytnout užitečné rady a tipy pro zlepšení kódu. Můžete také zadat konkrétní otázky ohledně kódu a dostat na ně přesné odpovědi."
    },

    card3: {
        title: "Proč jej použít?",
        description: "Použitím našeho nástroje ušetříte čas a úsilí při pochopení kódu a získáte cenné rady pro jeho zlepšení. Je to ideální nástroj pro vývojáře na všech úrovních zkušeností, ať už se chcete naučit nové technologie nebo chcete zlepšit svůj současný kód."
    },

    callToActionButton: {
        titleWhenSigned: "Použít",
        targetElementId: "input-form" // TODO: Change tnis.
    }
};

const CodeExplainer: NextPage = () => {
    return (
        <ModuleLandingPage props={landingPageProps}></ModuleLandingPage>
    );
};
export default CodeExplainer;