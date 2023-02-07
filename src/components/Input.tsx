import React from "react";
import {twMerge} from "tailwind-merge";
import TextareaAutosize from "react-textarea-autosize";

export default function Input(props: React.PropsWithChildren<{
    maxLen?: number,
    maxNum?: number,
    minNum?: number,
    minLen?: number,
    type?: string,
    placeholder?: string,
    className?: string,
    value?: string,
    onChange?: (val: string) => void,
    readonly?: boolean,

    label?: string,
    error?: string | null,

    theme?: "blue" | "gray",
    autosize?: boolean
    wrapped?: boolean,
}>) {
    const sharedProps = {
        maxLength: props.maxLen,
        readOnly: props.readonly || undefined,
        minLength: props.minLen,

        placeholder: props.placeholder,
        // TODO: Disallow autotextbox resize,
        className: twMerge(`focus:outline-none rounded-md py-3 px-4 focus:border ${props.autosize && "max-h-[90vh] resize-none"}
                ${props.theme === "gray" ? "border-gray-500 bg-gray-700 text-gray-100" : "focus:border-indigo-500 bg-t-blue-200 text-gray-300 border-transparent"} border shadow-2xl w-full
                appearance-none leading-normal ${props.className ?? ""}`),
        value: props.value,
        onChange: (e: any) => {
            e.preventDefault();
            props.onChange && props.onChange(e.target.value)
        },
    }

    return (
        <div className={"flex flex-col gap-1 w-full"}>
            {props.label && <label className={"text-md"}>{props.label}</label>}
            {
                props.autosize
                    ? <TextareaAutosize
                        {... sharedProps}/>
                    : <input
                        {... sharedProps}
                        max={props.maxNum}
                        min={props.minNum}
                        type={props.type || "text"}/>
            }
            {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
        </div>
    );
}