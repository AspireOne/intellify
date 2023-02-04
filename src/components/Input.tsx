import React from "react";
import {twMerge} from "tailwind-merge";

export default function Input(props: React.PropsWithChildren<{
    maxLen?: number,
    maxNum?: number,
    minNum?: number,
    minLen?: number,
    type?: string,
    placeholder?: string,
    className?: string,
    value?: string,
    onChange?: (e: string) => void,

    label?: string,
    error?: string | null,

    wrapped?: boolean
}>) {

    return (
        <div className={"flex flex-col w-full"}>
            {props.label && <label>{props.label}</label>}
            <input
                maxLength={props.maxLen}
                minLength={props.minLen}
                max={props.maxNum}
                min={props.minNum}
                type={props.type || "text"}
                placeholder={props.placeholder}
                className={twMerge(`bg-t-blue-200 focus:outline-none rounded-md py-3 px-4 focus:border 
                focus:border-indigo-500 border border-transparent shadow-2xl w-full text-gray-300 
                appearance-none leading-normal ${props.className ?? ""}`)}
                value={props.value}
                onChange={(e) => {
                    e.preventDefault();
                    props.onChange && props.onChange(e.target.value)
                }}
            />
            {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
        </div>
    );
}