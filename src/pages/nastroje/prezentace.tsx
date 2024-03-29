import type {NextPage} from 'next'
import React, {useState} from "react";
import Presentation from "../../lib/presentation";
import IOCard from "../../components/IOCard";
import ModuleLandingPage from "../../components/ModuleLandingPage";
import LandingPageProps from "../../lib/landingPageProps";
import Button from "../../components/Button";
import {Switch} from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import {InformationCircleOutline} from "react-ionicons";
import {AutoPopup} from "../../components/Popup";
import Input from "../../components/Input";
import {z} from "zod";
import {createPresentationInput} from "../../server/schemas/presentation";
import {trpc} from "../../lib/trpc";
import {twMerge} from "tailwind-merge";
import PageHead from "../../components/PageHead";

const landingPageProps: LandingPageProps = {
    title: "Vytvářejte prezentace s pomocí [A.I.]",
    description: "Profesionální a přizpůsobitelná prezentace do práce, do školy, i pro osobní projekty v řádu vteřin.",
    callToActionTextUnsigned: "Vyzkoušejte si hned teď, jaký rozdíl může náš nástroj ve vaší příští prezentaci udělat.",
    card1: {
        title: "Co to je?",
        description: "Tento nástroj vám umožní vytvářet rozsáhlé prezentace během vteřin. Je navržen tak, aby proces vytváření profesionálních, vizuálně příjemných prezentací byl rychlý a snadný. Díky široké škále nastavitelných parametrů a funkcí máte možnost vytvořit prezentaci, která skutečně odráží vaše sdělení."
    },
    card2: {
        title: "Co to umí?",
        description: "Přizpůsobte si parametry jako počet slidů, obrázky, nebo úvodní text, nechte si vygenerovat popisy jednotlivých bodů, libovolně pomocí psaného textu určete specifika prezentace, nebo vytvořte prezentaci na fiktivní téma. Zbytek nechte na našem A.I.!"
    },
    card3: {
        title: "Proč jej použít?",
        description: "Ušetříte si čas a úsilí a zajistíte, že vaše prezentace bude profesionální a vizuálně příjemná. Ať už jste majitel firmy, který chce prezentovat své výrobky nebo služby, student přednášející prezentaci ve třídě, nebo pracovník na volné noze, který se snaží představit potenciálnímu klientovi, náš nástroj vám pomůže."
    },
    callToActionButtonSigned: {
        title: "Vytvořit prezentaci",
        targetElementId: "input-form"
    }
};

const Prezentace: NextPage = () => {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [presentation, setPresentation] = useState<Presentation | null>(null);

    const presentationMutation = trpc.presentation.createPresentation.useMutation({
        onSuccess: (data, input) => {
            setContent(data.output);
            setPresentation(new Presentation(data.output, input));
        },
        onError: (error) => {
            setGlobalError(error.message);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    function handleSubmit(data: z.input<typeof createPresentationInput>): void {
        setLoading(true);
        presentationMutation.mutate(data);
    }

    return (
        <div>
            <PageHead title={"Prezentace"} description={"Profesionální a přizpůsobitelná prezentace do práce, do školy, i pro osobní projekty v řádu vteřin."} />
            <ModuleLandingPage props={landingPageProps}/>
            <div className={"flex flex-col gap-2 mx-auto lg:w-[62%]"}>
                <InputForm error={globalError} id={"input-form"} onSubmit={handleSubmit} loading={loading} className={"w-full"}/> {/*TODO: Make it responsive*/}
                {content && (
                    <IOCard text={"Výstup"} className={`rounded-none rounded-b-xl w-full`}>
                        <TextareaAutosize
                            value={content}
                            onChange={(val) => setContent(val.target.value)}
                            className="resize-none appearance-none overflow-y-auto focus:outline-none rounded-md p-5 bg-white bg-opacity-10 w-full">
                        </TextareaAutosize>
                        <DownloadPresRow onClick={author => presentation!.download(author)}/>
                    </IOCard>
                )}
            </div>
        </div>
    );
}

function DownloadPresRow(props: { onClick: (author: string) => void }) {
    const [author, setAuthor] = useState<string>("");

    return (
        <div className="card bg-t-blue-200 rounded-xl -mb-5 -mx-5 mt-10">
            <div className="p-4 flex items-center">
                <div className="flex-1">
                    <input
                        onChange={(event) => setAuthor(event.target.value)}
                        type="text"
                        className="bg-t-blue-50 focus:outline-none focus:shadow-outline-teal-500  rounded-md py-2 px-3 appearance-none leading-normal"
                        placeholder="Autor (volitelné)"
                        maxLength={25}
                    ></input>
                </div>
                <div className="max-w-md p-4">
                </div>
                <Button onClick={(e) => {
                    e.preventDefault();
                    props.onClick(author);
                }} className={"font-bold"}>
                    Stáhnout prezentaci
                </Button>
            </div>
        </div>
    );
}

function InputForm(props: {onSubmit: (params: z.input<typeof createPresentationInput>) => void, loading: boolean, id: string, className: string, error?: string | null}) {
    // State variables for the form input values
    const [topic, setTopic] = useState("");
    const [slides, setSlides] = useState("");
    const [points, setPoints] = useState("");

    const [introduction, setIntroduction] = useState<boolean>(false);
    const [includeImages, setIncludeImages] = useState<boolean>(false);
    const [conclusion, setConclusion] = useState<boolean>(false);
    const [description, setDescription] = useState("");
    const [describe, setDescribe] = useState(false);

    // State variables for the input errors
    const [topicError, setTopicError] = useState<string | null>();
    const [slidesError, setSlidesError] = useState<string | null>("");
    const [pointsError, setPointsError] = useState<string | null>("");

    function validateForm() {
        let isValid = true;

        // Validate the topic input
        if (topic === "") {
            setTopicError("Prosím vložte téma.");
            isValid = false;
        } else {
            setTopicError(null);
        }

        // Validate the slides input
        if (slides === "" || isNaN(Number(slides)) || Number(slides) < 1 || Number(slides) > 20) {
            setSlidesError("Neplatný počet slidů.");
            isValid = false;
        } else {
            setSlidesError(null);
        }

        // Validate the points input
        if (points === "" || isNaN(Number(points)) || Number(points) < 1 || Number(points) > 20) {
            setPointsError("Neplatný počet odrážek.");
            isValid = false;
        } else {
            setPointsError(null);
        }

        return isValid;
    }

    function handleSubmit(event: any): void {
        // Prevent page reload
        event.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            props.onSubmit({
                topic: topic,
                slides: Number(slides),
                points: Number(points),
                description: description,
                introduction: introduction,
                conclusion: conclusion,
                includeImages: includeImages,
                describe: describe
            });
        }
    }

    return (
        <IOCard id={props.id} text={"Vytvořte prezentaci"} className={twMerge(`rounded-t-2xl ${props.className}`)}>
            <div className="mx-auto max-w-lg flex flex-col gap-3">
                <div className={"flex flex-row items-center"}>
                    <Input maxLen={100} placeholder={"téma"} value={topic} wrapped={false}
                           onChange={(e) => {
                               setTopic(e);
                               setTopicError(null);
                           }} error={topicError} className={""}/>

                    <AutoPopup title={"Téma"}
                               trigger={<InformationCircleOutline cssClasses={"-ml-10"} width={"26px"} height={"auto"} color={"gray"}/>}>
                        <p>Obecné téma prezentace - může být skutečné, odborné, ale i fiktivní. Příklady:</p>
                        <ul className={"list-disc list-inside mt-1"}>
                            <li>"Význam fotosyntézy pro udržení života na planetě"</li>
                            <li>"Benefity existence kočkoholek"</li>
                            <li>"Historie Petra Pavla"</li>
                        </ul>
                    </AutoPopup>
                </div>

                <div className={"flex flex-row"}>
                    <Input
                        autosize={true}
                        maxLen={2200}
                        placeholder='Upřesnění (volitelné)'
                        value={description}
                        onChange={setDescription}
                        className="min-h-[100px] max-h-[80vh] bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border focus:border-indigo-500 border border-transparent box-border shadow-2xl w-full text-gray-300 appearance-none leading-normal block resize-y overflow-hidden flex-wrap"
                    />
                    <AutoPopup title={"Upřesnění"} trigger={<InformationCircleOutline cssClasses={"-ml-10 mt-4"} width={"26px"} height={"auto"} color={"gray"}/>}>
                        <p>
                            Libovolné upřesnění tématu nebo doplnění konkrétních informací.
                            Upřesnění může být libovolně dlouhé či konkrétní - čím více, tím lépe.
                            <br/><br/>
                            Hodí se zejména když vytváříte prezentaci o konkrétní věci, o které A.I. nemá dostupné
                            informace (např. vlastní produkt nebo fiktivní téma).
                            {/*<br/> TODO:
                            Příklady:*/}
                        </p>
                    </AutoPopup>
                </div>
                <Input maxNum={20} minNum={1} maxLen={2} type={"number"} placeholder={"Počet slidů"} value={slides} onChange={(e) => {
                    setSlides(e);
                    setSlidesError(null);
                }} error={slidesError}></Input>
                <Input maxNum={6} minNum={1} maxLen={2} type={"number"} placeholder={"Počet odrážek u každého slidu"} value={points} onChange={(e) => {
                    setPoints(e);
                    setPointsError(null);
                }} error={pointsError}></Input>
                <div className={"my-3 flex flex-col gap-3"}>
                    <Switch.Group>
                        {
                            [
                                {state: introduction, stateSetter: setIntroduction, text: "Napsat úvod"},
                                {state: conclusion, stateSetter: setConclusion, text: "Napsat závěr"},
                                {state: includeImages, stateSetter: setIncludeImages, text: "Vložit odkazy na obrázky"},
                                {state: describe, stateSetter: setDescribe, text: "Napsat vysvětlivky pro řečníka"},
                            ]
                                .map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <Switch
                                                className={`${item.state ? 'bg-indigo-700 ' : 'bg-gray-700 '} 
                                            relative inline-flex h-6 w-11 items-center rounded-full`}
                                                checked={item.state}
                                                onChange={item.stateSetter}
                                            >
                                        <span
                                            className={`${item.state ? 'translate-x-6 ' : 'translate-x-1 '} 
                                            inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                            </Switch>
                                            <Switch.Label className="ml-4">{item.text}</Switch.Label>
                                        </div>
                                    );
                                })
                        }
                    </Switch.Group>
                </div>
                <Button className={"my-2"} onClick={handleSubmit} loading={props.loading}>Generovat</Button>
                {props.error && <p className="text-red-500 text-center text-md">Chyba: {props.error}</p>}
            </div>
        </IOCard>
    );
}

export default Prezentace;