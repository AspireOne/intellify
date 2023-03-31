import React from "react";
import {twMerge} from "tailwind-merge";
import TextareaAutosize from "react-textarea-autosize";
import Skeleton from "react-loading-skeleton";

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
    onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void,
    readonly?: boolean,

    loading?: boolean,
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
        className: twMerge(`focus:outline-none rounded-md py-3 px-4 focus:border ${props.autosize && "max-h-[90vh] resize-none"}
                ${props.theme === "gray" ? "focus:border-gray-500 border-gray-600 bg-gray-700 text-gray-100" : "focus:border-indigo-500 bg-t-blue-200 text-gray-300 border-transparent"} border shadow-2xl w-full
                appearance-none leading-normal ${props.className ?? ""}`),
        value: props.value,
        onChange: (e: any) => {
            e.preventDefault();
            props.onChange && props.onChange(e.target.value)
        },
        onKeyDown: props.onKeyDown,
    }
    return (
        <div className={"flex flex-col gap-2 w-full"}>
            {props.label && <label className={"text-md"}>{props.label}</label>}
            {
                props.loading
                    ? <Skeleton className={"max-w-md rounded-md"} height={45}/>
                    : (
                        props.autosize
                            ? <TextareaAutosize {... sharedProps} minRows={1} />
                            : <input
                                {... sharedProps}
                                max={props.maxNum}
                                min={props.minNum}
                                type={props.type || "text"}/>
                    )
            }
            {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
        </div>
    );
}