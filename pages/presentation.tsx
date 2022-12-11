import type { NextPage } from 'next'
import React, {useState} from "react";
import type { QueryParams } from './api/presentation'
import {fromJSON} from "postcss";
import axios from "axios";
import * as QueryString from "querystring";
import Spinner from "./components/Spinner";
import pptxgen from "pptxgenjs";

function FormTitle(props: {children: string}) {
    return (
        <h3 className="text-2xl font-bold text-center">{props.children}</h3>
    );
}
const Presentation: NextPage = () => {
    // State variables for the form input values
    const [output, setOutput] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function handleSubmit(data: QueryParams) {
        /*axios.post('/presentation', {
            topic: topic,
            slides: slides,
            bullet_points: bullets
        })*/
        setLoading(true);
        // Create axios post request to /presentation with topic, slides and bullet_points
        axios.get(`/api/presentation/?topic=${data.topic}&slides=${data.slides}&points=${data.points}&description=${data.description}`)
            .then((response) => response.data.output)
            //.then((output) => output.replace("\n", "<br>"))
            .then((output) => {
                setOutput(output);
                setLoading(false);
            })
    }

    return (
        <div className="flex min-h-screen flex-col p-5 w-1/2 mx-auto">
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {output ? <OutputForm output={output} /> : undefined}
        </div>
    );
}

function OutputForm(props: {output: string}) {
    return (
        <div className="rounded shadow-xl my-5 p-5 bg-gray-100 whitespace-pre-wrap">
            <FormTitle>Prezentace</FormTitle>
            <p>{props.output}</p>
        </div>
    );
}

function InputForm(props: {onSubmit: (params: QueryParams) => void, loading: boolean}) {
    // State variables for the form input values
    const [topic, setTopic] = useState("");
    const [slides, setSlides] = useState("");
    const [points, setPoints] = useState("");
    const [description, setDescription] = useState("");

    // State variables for the input errors
    const [topicError, setTopicError] = useState<string|null>();
    const [slidesError, setSlidesError] = useState<string|null>("");
    const [bulletsError, setBulletsError] = useState<string|null>("");

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

        // Validate the bullets input
        if (points === "" || isNaN(Number(points)) || Number(points) < 1 || Number(points) > 20) {
            setBulletsError("Please enter a valid number of bullet points");
            isValid = false;
        } else {
            setBulletsError(null);
        }

        return isValid;
    }

    function handleSubmit(event: any): void {
        // Prevent page reload
        event.preventDefault();

        // Validate the form inputs
        const isValid = validateForm();

        if (isValid) props.onSubmit({topic, slides: Number(slides), points: Number(points), description: description});
    }

    return (
        <form className="relative rounded-md shadow-md bg-gray-100 py-2 pt-5">
            <FormTitle>Generujte prezentaci</FormTitle>
            <div className="mx-auto w-full max-w-sm py-3">
                <input
                    maxLength={70}
                    type="text"
                    id="topic"
                    placeholder="Topic"
                    className="bg-white focus:outline-none focus:shadow-outline-teal-500 border border-gray-300 rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                />
                {topicError && <div className="text-red-500 text-sm">{topicError}</div>}
            </div>
            <div className="mx-auto w-full max-w-sm py-3">
                <textarea
                    maxLength={300}
                    id="description"
                    placeholder="Description (optional - helpful if the topic is not very well known, fictional, or needs specification)"
                    rows={2}
                    className="resize-y overflow-hidden flex-wrap bg-white focus:outline-none focus:shadow-outline-teal-500 border border-gray-300 rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div className="mx-auto w-full max-w-sm py-3">
                <input
                    max={20}
                    min={1}
                    id="slides"
                    type="number"
                    placeholder="Amount of slides"
                    className="bg-white focus:outline-none focus:shadow-outline-teal-500 border border-gray-300 rounded-md py-2 px-3 w-full appearance-none leading-normal"
                    value={slides}
                    onChange={(event) => setSlides(event.target.value)}
                />
                {slidesError && <div className="text-red-500 text-sm">{slidesError}</div>}
            </div>
            <div className="mx-auto w-full max-w-sm py-3">
                <input
                    max={10}
                    min={1}
                    id="bullets"
                    type="number"
                    placeholder="Number of bullet points"
                    className="bg-white focus:outline-none focus:shadow-outline-teal-500 border border-gray-300 rounded-md py-2 px-3 block w-full appearance-none leading-normal"
                    value={points}
                    onChange={(event) => setPoints(event.target.value)}
                />
                {bulletsError && <div className="text-red-500 text-sm">{bulletsError}</div>}
            </div>
            <div className="mx-auto w-full max-w-sm pt-3">
                <button
                    onClick={handleSubmit}
                    className={`rounded-md bg-violet-700 w-30 h-10 text-white font-bold py-2 px-4 ${props.loading ? "cursor-not-allowed" : ""}`}
                >
                    {props.loading ? <Spinner className={"h-full aspect-square"}/> : "Generovat"}
                </button>
            </div>
        </form>
    );
}

/*function decomposePres(pres: String) {
    let presDecomposed: {};

    pres.split("\n").forEach((line) => {

    }
}

function genPres(pres: string): void {
    // 1. Create a new Presentation
    let gen = new pptxgen();

    // 2. Add a Slide
    let slide = gen.addSlide();

    // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
    let textboxText = "Hello World from PptxGenJS!";
    let textboxOpts = { x: 1, y: 1, color: "363636" };
    slide.addText(textboxText, textboxOpts);

    // 4. Save the Presentation
    gen.writeFile();
}*/
export default Presentation;