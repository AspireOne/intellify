import {NextPage} from "next";
import ModuleLandingPage from "../components/ModuleLandingPage";
import LandingPageProps from "../objects/LandingPageProps";

import TextareaAutosize from 'react-textarea-autosize';
import React, {useState} from "react";
import Button, {Style} from "../components/Button";
import axios from "axios";
import {CoderParams} from "./api/coder";


const landingPageProps: LandingPageProps = {
    title: "[A.I. asistent] pro psaní kódu []",
    description: "Snadné vysvětlení, úprava, rozšíření, nebo doporučení zlepšení pro váš kód během několika sekund.",
    callToActionTitle: "Vyzkoušejte si hned teď, jaký rozdíl může náš nástroj ve vašem příštím projektu udělat.",
    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožňuje pracovat se svým kódem s pomocí A.I. Váš kód podle zadání libovolně upraví, vylepší, nebo rozšíří, nebo vám poskytne doporučení a odpovědi na otázky ohledně kódu. To vše jen podle vašeho textového zadáni!"
    },
    card2: {
        title: "Co to umí?",
        description: "Můžete si nechat popsat informace o proměnných, funkcionalitě atd., nabídnout doporučené opravy či úpravy, generovat komentáře, ptát se na otázky ohledně daného kódu, konvertovat z jednoho jazyka do druhého, vygenerovat kód podle vašeho zadání... Možnosti jsou omezené jen fantazií!"

    },
    card3: {
        title: "Proč jej použit?",
        description: "Zrychlíte svou práci díky tomu, že budete schopni rychle analyzovat existující kód, porozumět mu, a identifikovat chyby. Dále vám usnadní vývoj díky možnosti generovat kód podle zadání. Začátečníkům může tento nástroj pomoci s pochopením základů programování, vývojem, a učením se programovat."

    },
    callToActionButton: {
        titleWhenSigned: "Přejít k asistentovi",
        targetElementId: "input-form"
    }
};

const KodovyAsistent: NextPage = () => {
    return (
        <>
            <ModuleLandingPage props={landingPageProps}></ModuleLandingPage>
            <IOForm id={"input-form"}/>
        </>
    );
};

const IOForm = (props: {id?: string}) => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [inputCommand, setInputCommand] = useState("");
    const [activeInputType, setActiveInputType] = useState<"command" | "question">("command");

    const [inputCodeError, setInputCodeError] = useState("");
    const [commandError, setCommandError] = useState("");

    function handleSubmit(): void {
        setLoading(true);
        let valid = validateInput();
        if (!valid) {
            setLoading(false);
            return;
        }

        const data: CoderParams = {
            code: inputCode,
            command: inputCommand,
            type: activeInputType
        }

        axios.post('/api/coder', data)
            .then((response) => response.data.output)
            .then(output => {
                setOutput(output);
            })
            .catch((error) => {
                // TODO: Flash the error etc.
                console.log(error.response.data.error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function validateInput() {
        let isValid = true;

/*        if (activeInputType === "question" && inputCode === "") {
            setInputCodeError("Pokud chcete mít otázku na kód, musíte nejprve vložit kód.");
            isValid = false;
        } else {
            setInputCodeError("");
        }*/

        if (inputCommand === "") {
            setCommandError("Prosím, zadejte příkaz nebo otázku.");
            isValid = false;
        } else {
            setCommandError("");
        }

        return isValid;
    }

    // Create a flexbox with two elements on top of each other on the left, and one on the right.
    return (
        <div id={props.id}>
            <TextareaAutosize
                placeholder="Kód k analýze, úpravě, nebo rozšíření. Nechte volné, pokud generujete nový kód."
                onChange={(e) => {
                    setInputCode(e.currentTarget.value);
                    setInputCodeError("");
                }}
                value={inputCode}
                className="max-h-[90vh] min-h-[290px] bg-t-blue-500 resize-none focus:outline-none rounded-md p-5 w-full appearance-none overflow-y-auto"
            />
            {inputCodeError && <div className="mb-2 text-red-500 text-sm">{inputCodeError}</div>}
            <div className="flex flex-row gap-2">
                {/*<div className={"w-12"}>
                    <SwapVertical color={"#fff"} height={"100%"} width={"100%"} />
                </div>*/}
                <div className={"flex flex-col w-full"}>
                    <input
                        maxLength={300}
                        placeholder='"Vysvětli kód", "přelož kód do jazyka C#", "Proč se div s id "header" necentruje?" ...'
                        onChange={(e) => {
                            setInputCommand(e.currentTarget.value);
                            setCommandError("");
                        }}
                        className="bg-t-blue-500 block resize-none focus:outline-none rounded-md p-5 w-full appearance-none leading-normal"
                    />
                </div>
                <div className="flex flex-col text-md duration-100">
                    <button onPointerDown={() => setActiveInputType("command")}
                            className={"text-sm rounded-t-md duration-100 h-1/2 py-1 px-2" + (activeInputType === "command" ? " bg-indigo-600" : " bg-indigo-600 bg-opacity-20")}>
                        Příkaz
                    </button>
                    <button onPointerDown={() => setActiveInputType("question")}
                            className={"text-sm rounded-b-md duration-100 h-1/2 py-1 px-2" + (activeInputType === "question" ? " bg-indigo-600" : " bg-indigo-600 bg-opacity-20")}>
                        Otázka
                    </button>
                </div>
                <Button loading={loading} onClick={handleSubmit} className={"w-1/4 text-md"}>Potvrdit</Button>
            </div>
            {commandError && <div className="text-red-500 text-sm m-1">{commandError}</div>}
            {
                // TODO: Make the margin bottom not hardocded.
                (<div className="text-sm font-mono relative max-h-[90vh] min-h-[290px] overflow-hidden bg-t-blue-800 mt-[0.4rem] w-full p-5 pb-14 rounded-md">
                    {!output && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-sans text-lg text-gray-500">Výstup se zobrazí zde.</div>}
                    {output &&
                        (
                        <>
                            {output}
                            <div className={"font-sans absolute bottom-5 right-5 bg-indigo-700 bg-opacity-20 p-2 rounded-3xl"}>
                                <Button style={Style.OUTLINE}
                                        onClick={() => navigator.clipboard.writeText(output)}
                                        className={"mr-3 rounded-2xl"}>
                                    Kopírovat
                                </Button>
                                <Button style={Style.OUTLINE}
                                        onClick={() => {
                                            setInputCode(output);
                                            setOutput("");
                                        }}
                                        className={"rounded-2xl"}>
                                    Vložit do vstupu
                                </Button>
                            </div>
                        </>
                        )}
                </div>)
            }
        </div>
    );
}

export default KodovyAsistent;