import React from "react";
import {twMerge} from "tailwind-merge";
import TextareaAutosize from "react-textarea-autosize";
import Skeleton from "react-loading-skeleton";

const getSharedClasses = (theme?: "blue" | "gray") => {
    return `focus:outline-none rounded-md py-3 px-4 focus:border
                ${theme === "gray" ? "focus:border-gray-500 border-gray-600 bg-gray-700 text-gray-100" : "focus:border-indigo-500 bg-t-blue-200 text-gray-300 border-transparent"} border shadow-lg w-full
                appearance-none leading-normal`
}

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
    minRows?: number,
}>) {
    const sharedProps = {
        maxLength: props.maxLen,
        readOnly: props.readonly || undefined,
        minLength: props.minLen,

        placeholder: props.placeholder,
        className: twMerge(getSharedClasses(props.theme), props.autosize && "max-h-[90vh] resize-none", props.className),
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
                            ? <TextareaAutosize {... sharedProps} minRows={props.minRows || 1} />
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

export function Select(props: {label: string, placeholder: string, value: string, setValue: (val: string) => void, options: {label: string, value: string}[]}) {

    return (
        <div className={"flex flex-col gap-2 w-full"}>
            <label htmlFor={props.label} className="text-md">{props.label}</label>
            <select id={props.label} className="outline-none bg-gray-50 border border-gray-300
            text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block
            w-full p-4
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-gray-500">
                {
                    props.options.map((option, index) => (
                        <option
                            onClick={() => props.setValue(option.value)}
                            className={`${props.value === option.value && "bg-indigo-500 p-4"}`}
                            key={index}
                            value={option.value}>
                            <div className={"p-4 bg-white"}>
                                {option.label}
                            </div>
                        </option>
                    ))
                }
            </select>
        </div>
    )
}