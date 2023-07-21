import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";
import Spinner from "./Spinner";
import Link from "next/link";

export enum Style {FILL, OUTLINE, NONE}
type ButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    loading?: boolean
    loadingText?: string
    disabled?: boolean
    className?: string
    style?: Style
    children: React.ReactNode
    href?: string
}

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
            onClick={(e) => {
                e.preventDefault();
                if (props.loading) return;
                props.onClick && props.onClick(e);
            }}
            onMouseDown={() => setIsBeingClicked(true)}
            disabled={props.loading || props.disabled}
            className={getStyles(props.style, isBeingClicked, props.loading || props.disabled, props.className)}>

            {props.loading && <Spinner className={(props.loadingText || props.children) ? `mr-2` : ""}/>}
            {
                props.loading && props.loadingText
                    ? <span className="">{props.loadingText}</span>
                    : props.children
            }
        </button>
    );
}

/*export function LinkButton(props: PropsWithChildren<{href: string, style?: Style, className?: string}>) {
    const [isBeingClicked, setIsBeingClicked] = React.useState(false);

    // Check global mouse up.
    React.useEffect(() => {
        const onMouseUp = () => setIsBeingClicked(false);
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, []);

    return (
        <Link href={props.href} className={getStyles(props.style, isBeingClicked, false, props.className)}>
            {props.children}
        </Link>
    )
}*/

function getStyles(style?: Style, isBeingClicked?: boolean, loading?: boolean, className?: string) {
    let styling;
    switch (style) {
        case Style.OUTLINE:
            styling = twMerge(
                `border-solid border-2 border-indigo-700
                ${isBeingClicked && "bg-indigo-800"}
                ${!isBeingClicked && !loading
                && "hover:bg-indigo-500 hover:bg-opacity-20 hover:border-indigo-500 bg-indigo-800 bg-opacity-5"}`
            )
            break;

        case Style.NONE:
            styling = "";
            break;

        case Style.FILL:
        default:
            styling = twMerge(
                "border border-gray-400/20 shadow-md",
                !isBeingClicked && !loading && "hover:bg-indigo-500",
                isBeingClicked ? "bg-indigo-800" : loading ? "bg-indigo-800" : "bg-indigo-700"
            )
            break;
    }

    const universal = `
    duration-200 font-medium rounded-md text-md text-gray-200 px-5 py-2.5
    outline-none focus:outline-none ${loading && "cursor-default"}`;

    return twMerge(universal, styling, className);
}

export default Button;