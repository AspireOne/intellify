import React, {FunctionComponent} from "react";
import Spinner from "./Spinner";
import {assertTSTypeElement} from "@babel/types";
import {twMerge} from "tailwind-merge";

export enum Style {FILL, OUTLINE}
type ButtonProps = {
    onClick?: (event: any) => void;
    loading?: boolean
    className?: string;
    style?: Style;
    children: React.ReactNode;
}

// TODO: Allow to pass in any properties and classes and USE IT.
const Button = (props: ButtonProps) => {
    const [isBeingClicked, setIsBeingClicked] = React.useState(false);
    // Check global mouse up.
    React.useEffect(() => {
        const onMouseUp = () => setIsBeingClicked(false);
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, []);

    let btnClasses;

    switch (props.style) {
        case Style.OUTLINE:
            btnClasses =
                // TODO: This fucker is hardcoded, because there is apparently no fucking way to create an inner border
                // in talwind css. What the fuck guys?
                "border-solid border-2 border-indigo-700 py-[0.5rem]"
                + (!isBeingClicked && !props.loading && " hover:bg-indigo-500 hover:bg-opacity-20 hover:border-indigo-500")
                + (isBeingClicked ? " bg-indigo-800 py-[0.5rem]" : props.loading ? " bg-indigo-800" : " bg-transparent")
            break;

        default:
            btnClasses =
                (!isBeingClicked && !props.loading && " hover:bg-indigo-500")
                + (isBeingClicked ? " bg-indigo-800" : props.loading ? " bg-indigo-800" : " bg-indigo-700")
            break;
    }

    return (
        <button
            onClick={props.onClick}
            onMouseDown={() => setIsBeingClicked(true)}
            disabled={props.loading}
            className={twMerge("duration-200 rounded-md text-sm px-5 py-2.5 outline-none focus:outline-none "
                + (props.loading && " cursor-not-allowed")
                + btnClasses + " "
                + (props.className ?? ""))}>

            {props.loading && <Spinner/>}
            {props.children}
        </button>
    );
}
export default Button;