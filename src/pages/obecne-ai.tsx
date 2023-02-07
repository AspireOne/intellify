import LandingPageProps from "../lib/landingPageProps";
import {NextPage} from "next";
import ModuleLandingPage from "../components/ModuleLandingPage";
import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import {Copy, CopyOutline, Send} from "react-ionicons";
import TextareaAutosize from "react-textarea-autosize";
import IOCard from "../components/IOCard";
import {trpc} from "../utils/trpc";

const landingPageProps: LandingPageProps = {
    title: "Získávejte odpovědi s pomocí [A.I.]",
    description: "Okamžité a přesné odpovědi na vaše otázky v oboru všeobecných znalostí.",
    callToActionTextUnsigned: "Vyzkoušejte si hned teď, jak rychle a snadno získáte odpovědi na své otázky.",
    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožní rychle a snadno získávat odpovědi na vaše otázky v oboru všeobecných znalostí. Je navržen tak, aby odpovědi byly přesné a okamžité."
    },
    card2: {
        title: "Co to umí?",
        description: "Odpovídat na různé typy otázek v oboru všeobecných znalostí, od historických událostí a vědeckých faktů až po zábavné triviální otázky. Nástroj je schopen rozpoznat typ otázky a najít pro ni nejlepší odpověď."
    },
    card3: {
        title: "Proč jej použít?",
        description: "Ušetříte si čas při hledání odpovědí na vaše otázky a získáte přesné a rychlé odpovědi. Ideální pro školáky, studenty, zvídavé jedince a kohokoli, kdo potřebuje rychle získat odpověď na svou otázku."
    },
    callToActionButtonSigned: {
        title: "Získat odpověď",
        targetElementId: "input-form"
    }
};

// TODO: Implement "continue" button.
const GeneralAi: NextPage = () => {
    const [input, setInput] = React.useState<string>("");
    const [output, setOutput] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const generateMutation = trpc.generalAi.generate.useMutation({
        onSuccess: (data) => {
            setOutput(data.response);
        },
        onError: (err) => {
            setError(err.message);
        },
        onSettled: () => {
            setLoading(false);
        }
    })

    function handleSubmit() {
        let isValid = true;
        setLoading(true);

        if (input.length < 1) {
            isValid = false;
        }

        if (input.length > 10_000) {
            isValid = false;
            setError("Text je moc dlouhý.");
        }

        if (!isValid) {
            setLoading(false);
            return;
        }

        generateMutation.mutate({prompt: input});
    }

    return (
        <div>
            <ModuleLandingPage props={landingPageProps}/>
            <div className={"text-center"}>
                <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-2">
                    Vědomosti na dosah ruky
                </h2>
                <p className={"text-gray-300"}>
                    Generujte text, ptejte se na otázky, překládejte jazyky, nechte si shrnout texty a další.
                </p>
            </div>

            <div className={"flex flex-row mx-auto max-w-xl gap-2 items-end mt-12 mb-6"}>
                <Input value={input} error={error} className={"p-4 max-h-80vh"} maxLen={2000} minLen={1}
                       readonly={loading}
                       onChange={(val) => {
                           setError(null);
                           setInput(val);
                       }}
                       onKeyDown={(e) => {
                           // Submit if enter is pressed.

                            if (e.key === "Enter" && !e.shiftKey) {
                                handleSubmit();
                                e.preventDefault();
                            }
                       }}
                       autosize={true} placeholder={"Váš dotaz, zadaní, text..."}/>
                <Button className={"h-[3.5rem] w-14 p-4"} loading={loading} onClick={handleSubmit}>
                    {!loading && <Send color={"white"}/>}
                </Button>
            </div>

            <div className={"max-w-3xl 2xl:max-w-4xl mx-auto mb-32"}>
                <div className={"bg-t-alternative-700 bg-opacity-70 px-4 p-2 text-sm rounded-t-lg flex flex-row justify-between items-center"}>
                    <p className={"text-lg"}>Výstup</p>
                    <Button className={"bg-transparent p-0 hover:underline hover:bg-transparent"} onClick={() => navigator.clipboard.writeText(output)}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <CopyOutline color={"#fff"} width={"15px"} height={"auto"}/>
                            Zkopírovat
                        </div>
                    </Button>
                </div>
                <IOCard title={""} className={`rounded-none rounded-lg rounded-t-none p-6 pt-0`}>
                    {output}
                </IOCard>
            </div>
        </div>
    )
}
export default GeneralAi;