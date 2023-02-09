import React from "react";
import {twMerge} from "tailwind-merge";

const Slider = (props: {
    loading?: boolean,
    onChange?: (val: number) => void,
    className?: string,
    sideValsClassName?: string,

    leftVal?: string | number,
    rightVal?: string | number,
    step?: number,
    max?: number,
    min?: number,
    value?: number,
}) => {
    return (
        <div className={"flex flex-row gap-2 items-center text-gray-400"}>
            {props.leftVal && <span className={props.sideValsClassName}>{props.leftVal}</span>}
            <input onChange={(val) => props.onChange && props.onChange(val.target.valueAsNumber)}
                   disabled={props.loading} type="range" max={props.max} min={props.min}
                   value={props.value} step={props.step} className={
                twMerge(`accent-indigo-500 form-range flex-grow w-full 
                h-[0.35rem] bg-gray-200 rounded-lg appearance-none cursor-pointer 
                dark:bg-gray-700 ${props.className}`)}
            />
            {props.rightVal && <span className={props.sideValsClassName}>{props.rightVal}</span>}
        </div>
    )
}

export default Slider;