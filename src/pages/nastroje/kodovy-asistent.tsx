import {NextPage} from "next";
import ModuleLandingPage from "../../components/ModuleLandingPage";
import LandingPageProps from "../../lib/landingPageProps";

import TextareaAutosize from 'react-textarea-autosize';
import React, {useState} from "react";
import Button, {Style} from "../../components/Button";
import {z} from "zod";
import {assistCodeInput} from "../../server/schemas/code";
import {trpc} from "../../lib/trpc";


const landingPageProps: LandingPageProps = {
    title: "[A.I. asistent] pro psaní kódu []",
    description: "Snadné vysvětlení, úprava, rozšíření, nebo doporučení zlepšení pro váš kód během několika sekund.",
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
    callToActionTextUnsigned: "Vyzkoušejte si hned teď, jaký rozdíl může náš nástroj ve vašem příštím projektu udělat.",
    callToActionButtonSigned: {
        title: "Přejít k asistentovi",
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

    const asisstCodeMutation = trpc.code.assistCode.useMutation({
        onSuccess: (data, input) => {
            setOutput(data.output);
        },
        onError: (error) => {
            setCommandError(error.message);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    function handleSubmit(): void {
        setLoading(true);

        let isValid = true;

        if (inputCommand === "") {
            setCommandError("Prosím, zadejte příkaz nebo otázku.");
            isValid = false;
        } else {
            setCommandError("");
        }

        if (inputCode.length > 5000) {
            setInputCodeError("Kód je příliš dlouhý.");
            isValid = false;
        } else {
            setInputCodeError("");
        }

        if (!isValid) {
            setLoading(false);
            return;
        }

        const data: z.input<typeof assistCodeInput> = {
            code: inputCode,
            command: inputCommand,
            type: activeInputType
        }

        asisstCodeMutation.mutate(data);
    }

    // Create a flexbox with two elements on top of each other on the left, and one on the right.
    return (
        // TODO: history at the left?
        <div id={props.id}>
            <TextareaAutosize
                placeholder="Kód k analýze, úpravě, nebo rozšíření. Nechte volné, pokud generujete nový kód."
                onChange={(e) => {
                    setInputCode(e.currentTarget.value);
                    setInputCodeError("");
                }}
                value={inputCode}
                className="max-h-[85vh] min-h-[200px] bg-t-blue-500 resize-none focus:outline-none rounded-md p-5 w-full appearance-none overflow-y-auto"
            />
            {inputCodeError && <div className="mb-2 text-red-500 text-sm">{inputCodeError}</div>}
            <div className="flex flex-row gap-2">
                <div className={"flex flex-col w-full"}>
                    <input
                        maxLength={300}
                        placeholder='"Vysvětli", "přelož do jazyka C#", "Nakóduj navbar", "Proč se div s id "header" necentruje?",  ...'
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
                (<div className="text-sm font-mono relative max-h-[90vh] overflow-auto min-h-[290px] bg-t-blue-800 mt-[0.4rem] w-full p-5 pb-14 rounded-md">
                    {!output && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-sans text-lg text-gray-500">Výstup se zobrazí zde.</div>}
                    {output && (
                        <>
                            <div className={"whitespace-pre-wrap text-sm"}>
                                {output}
                            </div>
                            <div className={"font-sans absolute top-5 right-5 bg-indigo-700 bg-opacity-20 p-2 rounded-md"}>
                                <Button style={Style.OUTLINE}
                                        onClick={() => navigator.clipboard.writeText(output)}
                                        className={"mr-3 rounded-md"}>
                                    Kopírovat
                                </Button>
                                <Button style={Style.OUTLINE}
                                        onClick={() => {
                                            setInputCode(output);
                                            setOutput("");
                                        }}
                                        className={"rounded-md"}>
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