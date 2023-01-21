import type {NextPage} from 'next'
import React, {useState} from "react";
import type {PresentationProps} from './api/presentation'
import axios from "axios";
import PresentationObj from "../objects/PresentationObj";
import IOCard from "../components/IOCard";
import ModuleLandingPage from "../components/ModuleLandingPage";
import LandingPageProps from "../objects/LandingPageProps";
import Button from "../components/Button";
import {Switch} from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import {InformationCircle, InformationCircleOutline} from "react-ionicons";
import Popup from "../components/Popup";

const landingPageProps: LandingPageProps = {
    title: "Vytvářejte prezentace s pomocí [A.I.]",
    description: "Profesionální a přizpůsobitelná prezentace do práce, do školy, i pro osobní projekty v řádu vteřin.",
    callToActionTitle: "Vyzkoušejte si hned teď, jaký rozdíl může náš nástroj ve vaší příští prezentaci udělat.",
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
    callToActionButton: {
        titleWhenSigned: "Vytvořit prezentaci",
        targetElementId: "input-form"
    }
};

const Prezentace: NextPage = () => {
    // State variables for the form input values
    const [output, setOutput] = useState<PresentationObj | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function handleSubmit(data: PresentationProps): void {
        setLoading(true);

        axios.post('/api/presentation', data)
            .then((response) => response.data.output)
            .then((output) => {
                setOutput(new PresentationObj(output, data));
                setLoading(false);
            })
    }

    return (
        <div>
            <ModuleLandingPage props={landingPageProps}/>
            <div className={"flex flex-col gap-2"}>
                <InputForm id={"input-form"} onSubmit={handleSubmit} loading={loading} className={"w-[60%]"}/> {/*TODO: Make it responsive*/}
                {output && <OutputForm output={output} className={"w-[60%]"}/>}
            </div>
        </div>
    );
}

function OutputForm(props: { output: PresentationObj, className?: string }) {
    return (
        <div className="">
            <IOCard title={"Výstup"} className={`rounded-none rounded-b-2xl ${props.className}`}>
                <p>{props.output.AiOutput}</p>
                <DownloadPresRow presentation={props.output}/>
            </IOCard>
        </div>
    );
}

function DownloadPresRow(props: { presentation: PresentationObj }) {
    const [author, setAuthor] = useState<string>("");
    const [includeIntroAndConclu, setIncludeIntroAndConclu] = useState<boolean>(false);

    function onDownloadClick() {
        props.presentation.download();
    }

    return (
        <div className="card bg-t-blue-200 rounded-2xl -mb-5 -mx-5 mt-10">
            <div className="p-4 flex items-center">
                <div className="flex-1">
                    {/*<label className="mx-2"><input className="mx-2" type="checkbox" value="value"></input>Poděkování za pozornost</label>*/}
                    <input
                        onChange={(event) => setAuthor(event.target.value)}
                        type="text"
                        className="bg-t-blue-50 focus:outline-none focus:shadow-outline-teal-500  rounded-md py-2 px-3 appearance-none leading-normal"
                        placeholder="Autor (volitelné)"
                        maxLength={25}
                    ></input>
                </div>
                <div className="max-w-md p-4">
                    {/*<div className="flex items-center">
                        <input
                            id="include-info"
                            type="checkbox"
                            className="form-checkbox h-6 w-6 accent-blue-500"
                            checked={includeIntroAndConclu}
                            onChange={(event) => setIncludeIntroAndConclu(event.target.checked)}
                        />
                        <label className="ml-2 block text-sm">
                            Zahrnout úvod a závěr
                        </label>
                    </div>*/}
                </div>
                <Button onClick={onDownloadClick} className={"font-bold"}>
                    Stáhnout prezentaci
                </Button>
            </div>
        </div>
    );
}

function InputForm(props: { onSubmit: (params: PresentationProps) => void, loading: boolean, id: string, className: string }) {
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
            setSlidesError("Musíte určit počet slidů.");
            isValid = false;
        } else {
            setSlidesError(null);
        }

        // Validate the points input
        if (points === "" || isNaN(Number(points)) || Number(points) < 1 || Number(points) > 20) {
            setPointsError("Musíte určit počet odrážek.");
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

    // TODO: Add focus color.
    return (
        <IOCard id={props.id} title={"Vytvořte prezentaci"} className={props.className}>
            <div className="mx-auto max-w-lg py-3">
                <div className={"flex flex-row items-center"}>
                    <input
                        maxLength={70}
                        type="text"
                        placeholder="Téma"
                        className="my-2 bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border focus:border-indigo-500 border border-transparent box-border shadow-2xl w-full text-gray-300 appearance-none leading-normal"
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                    />
                    <Popup title={"Téma"} trigger={<InformationCircleOutline cssClasses={"-ml-10"} width={"26px"} height={"auto"} color={"gray"}></InformationCircleOutline>}>
                        <p>Obecné téma prezentace - může být skutečné, odborné, ale i fiktivní. Příklady:</p>
                        <ul className={"list-disc list-inside mt-1"}>
                            <li>"Význam fotosyntézy pro udržení života na planetě"</li>
                            <li>"Benefity existence kočkoholek"</li>
                            <li>"Historie Petra Pavla"</li>
                        </ul>
                    </Popup>
                </div>
                {topicError && <div className="text-red-500 text-sm">{topicError}</div>}

                <div className={"flex flex-row items-center"}>
                    <TextareaAutosize
                        maxLength={2000}
                        // TODO: Explain it.
                        placeholder='Upřesnění (volitelné)'
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="my-2 min-h-[100px] max-h-[80vh] bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border focus:border-indigo-500 border border-transparent box-border shadow-2xl w-full text-gray-300 appearance-none leading-normal block resize-y overflow-hidden flex-wrap"
                    />
                    <Popup title={"Upřesnění"} trigger={<InformationCircleOutline cssClasses={"-ml-10"} width={"26px"} height={"auto"} color={"gray"}></InformationCircleOutline>}>
                        <p>
                            Libovolné upřesnění tématu nebo doplnění konkrétních informací.
                            Upřesnění může být libovolně dlouhé či konkrétní - čím více, tím lépe.
                            <br/><br/>
                            Hodí se zejména když vytváříte prezentaci o konkrétní věci, o které A.I. nemá dostupné
                            informace (např. vlastní produkt nebo fiktivní téma).
                            {/*<br/>
                            Příklady:*/}
                        </p>
                    </Popup>
                </div>
                <input
                    max={20}
                    min={1}
                    type="number"
                    placeholder="Počet slidů"
                    className="my-2 bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border focus:border-indigo-500 border border-transparent box-border shadow-2xl w-full text-gray-300 appearance-none leading-normal"
                    value={slides}
                    onChange={(event) => setSlides(event.target.value)}
                />
                {slidesError && <div className="text-red-500 text-sm">{slidesError}</div>}
                <input
                    max={10}
                    min={1}
                    type="number"
                    placeholder="Počet odrážek u každého slidu"
                    className="my-2 bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border focus:border-indigo-500 border border-transparent box-border shadow-2xl w-full text-gray-300 appearance-none leading-normal"
                    value={points}
                    onChange={(event) => setPoints(event.target.value)}
                />
                {pointsError && <div className="text-red-500 text-sm">{pointsError}</div>}
                <div className={"mt-5"}></div>
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
                                    <div className={"my-2"} key={index}>
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
                <div className={"mb-5"}></div>
                <Button className={"my-2"} onClick={handleSubmit} loading={props.loading}>Generovat</Button>
            </div>
        </IOCard>
    );
}

export default Prezentace;