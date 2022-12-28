import type { NextPage } from 'next'
import React, {useState} from "react";
import type { PresParams } from './api/presentation'
import {fromJSON} from "postcss";
import axios from "axios";
import * as QueryString from "querystring";
import Spinner from "./components/Spinner";
import pptxgen from "pptxgenjs";
import PresOutput from "./objects/PresOutput";
import IOCard from "./components/IOCard";
import ModuleLandingPage from "./components/ModuleLandingPage";
import LandingPageProps from "./objects/LandingPageProps";
import Button from "./components/Button";

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

const Presentation: NextPage = () => {
    // State variables for the form input values
    const [output, setOutput] = useState<PresOutput|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

        function handleSubmit(data: PresParams) {
            setLoading(true);
        /*axios.post('/presentation', {
            topic: topic,
            slides: slides,
            bullet_points: bullets
        })*/
        // Create axios post request to /presentation with topic, slides and bullet_points
            axios.get(`/api/presentation/?topic=${data.topic}&slides=${data.slides}&points=${data.points}&description=${data.description}$includeImages=${data.includeImages}&introduction=${data.introduction}&conclusion=${data.conclusion}`)
                .then((response) => response.data.output)
                .then((output) => {
                setOutput(new PresOutput(output, data));
                setLoading(false);
            })
    }

    return (
        <div className="">
            <ModuleLandingPage props={landingPageProps}/>
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {output && <OutputForm output={output} />}
        </div>
    );
}

function OutputForm(props: {output: PresOutput}) {
    return (
        <div className="my-5">
            <IOCard title={"Výstup"}>
                <p>{props.output.output}</p>
            </IOCard>
            <DownloadPresRow pres={props.output} />
        </div>
    );
}

function DownloadPresRow(props: {pres: PresOutput}) {
    const [author, setAuthor] = useState<string>("");
    const [includeIntroAndConclu, setIncludeIntroAndConclu] = useState<boolean>(false);

    function onDownloadClick() {
        props.pres.downloadPres(
            props.pres.genPres(author || undefined, props.pres.params.includeImages, includeIntroAndConclu),
            props.pres.params.topic
        );
    }
    return (
        <div className="card bg-t-blue-200 rounded-b w-full">
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
                    <div className="flex items-center">
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
                    </div>
                </div>
                <button
                    className="bg-indigo-600 hover:bg-indigo-900 font-bold py-2 px-4 rounded"
                    onClick={onDownloadClick}
                >
                    Stáhnout prezentaci
                </button>
            </div>
        </div>
    );
}

function InputForm(props: {onSubmit: (params: PresParams) => void, loading: boolean}) {
    // State variables for the form input values
    const [topic, setTopic] = useState("");
    const [slides, setSlides] = useState("");
    const [points, setPoints] = useState("");
    const [introduction, setIntroduction] = useState<boolean>(false);
    const [includeImages, setIncludeImages] = useState<boolean>(false);
    const [conclusion, setConclusion] = useState<boolean>(false);
    const [description, setDescription] = useState("");

    // State variables for the input errors
    const [topicError, setTopicError] = useState<string|null>();
    const [slidesError, setSlidesError] = useState<string|null>("");
    const [pointsError, setPointsError] = useState<string|null>("");

    function validateForm() {
        let isValid = true;

        // Validate the topic input
        if (topic === "") {
            setTopicError("Please enter a topic");
            isValid = false;
        } else {
            setTopicError(null);
        }

        // Validate the slides input
        if (slides === "" || isNaN(Number(slides)) || Number(slides) < 1 || Number(slides) > 20) {
            setSlidesError("Please enter a valid number of slides");
            isValid = false;
        } else {
            setSlidesError(null);
        }

        // Validate the points input
        if (points === "" || isNaN(Number(points)) || Number(points) < 1 || Number(points) > 20) {
            setPointsError("Please enter a valid number of bullet points");
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
        if (isValid) props.onSubmit({
            topic,
            slides: Number(slides),
            points: Number(points),
            description: description,
            introduction: introduction,
            conclusion: conclusion,
            includeImages: includeImages
        });
    }

    // TODO: Add focus color.
    return (
        <IOCard title={"Vytvořte prezentaci"}>
            <div className="mx-auto max-w-md py-3">
                <input
                    maxLength={70}
                    type="text"
                    id="topic"
                    placeholder="Téma"
                    className="bg-t-blue-200 focus:outline-none rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                />
                {topicError && <div className="text-red-500 text-sm">{topicError}</div>}
            </div>
            <div className="mx-auto max-w-md py-3">
                <textarea
                    maxLength={300}
                    id="description"
                    placeholder="Upřesnění (volitelné - užitečné, pokud téma není příliš známe, je fiktivní, nebo chcete parametry prezentace specifikovat)"
                    rows={3}
                    className="bg-t-blue-200 resize-y overflow-hidden flex-wrap focus:outline-none rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div className="mx-auto max-w-md py-3">
                <input
                    max={20}
                    min={1}
                    id="slides"
                    type="number"
                    placeholder="Množství slidů"
                    className="bg-t-blue-200 focus:outline-none rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={slides}
                    onChange={(event) => setSlides(event.target.value)}
                />
                {slidesError && <div className="text-red-500 text-sm">{slidesError}</div>}
            </div>
            <div className="mx-auto max-w-md py-3">
                <input
                    max={10}
                    min={1}
                    id="bullets"
                    type="number"
                    placeholder="Množství bodů"
                    className="bg-t-blue-200 focus:outline-none rounded-md py-2 px-3 outline-none w-full appearance-none leading-normal"
                    value={points}
                    onChange={(event) => setPoints(event.target.value)}
                />
                {pointsError && <div className="text-red-500 text-sm">{pointsError}</div>}
            </div>
            <div className="mx-auto max-w-md py-3">
                <div className="flex items-center">
                    <input
                        id="include-image-placeholders-checkbox"
                        type="checkbox"
                        className="form-checkbox h-5 w-5 accent-blue-500"
                        checked={includeImages}
                        onChange={(event) => setIncludeImages(event.target.checked)}
                    />
                    <label htmlFor="checkbox" className="ml-2 block text-sm">
                        Vložit odkazy na obrázky
                    </label>
                </div>
            </div>
            <div className="mx-auto max-w-md py-3">
                <div className="flex items-center">
                    <input
                        id="include-image-placeholders-checkbox"
                        type="checkbox"
                        className="form-checkbox h-5 w-5 accent-blue-500"
                        checked={introduction}
                        onChange={(event) => setIntroduction(event.target.checked)}
                    />
                    <label htmlFor="checkbox" className="ml-2 block text-sm">
                        Napsat úvod
                    </label>
                </div>
            </div>
            <div className="mx-auto max-w-md py-3">
                <div className="flex items-center">
                    <input
                        id="include-image-placeholders-checkbox"
                        type="checkbox"
                        className="form-checkbox h-5 w-5 accent-blue-500"
                        checked={conclusion}
                        onChange={(event) => setConclusion(event.target.checked)}
                    />
                    <label htmlFor="checkbox" className="ml-2 block text-sm">
                        Napsat závěr
                    </label>
                </div>
            </div>
            <div className="mx-auto max-w-md pt-3">
                <Button
                    onClick={handleSubmit}
                    loading={props.loading}
                >
                    Generovat
                </Button>
            </div>
        </IOCard>
    );
}
export default Presentation;