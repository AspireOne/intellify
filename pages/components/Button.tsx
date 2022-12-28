import React, {FunctionComponent} from "react";
import Spinner from "./Spinner";
import {assertTSTypeElement} from "@babel/types";

type ButtonProps = {
    onClick: (event: any) => void;
    loading: boolean
    className?: string;
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

    return (
        <button
            onClick={props.onClick}
            onMouseDown={() => setIsBeingClicked(true)}
            disabled={props.loading}
            className={"duration-200 rounded-md text-sm px-5 py-2.5 outline-none focus:outline-none "
                + (props.loading && " cursor-not-allowed")
                + (!isBeingClicked && !props.loading && " hover:bg-indigo-500")
                + (isBeingClicked ? " bg-indigo-800 " : props.loading ? " bg-indigo-800 " : " bg-indigo-700 ")
                + (props.className || "")}>

            {props.loading && <Spinner/>}
            {props.children}
        </button>
    );
}
export default Button;