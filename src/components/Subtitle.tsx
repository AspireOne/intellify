import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

export default function Subtitle(props: PropsWithChildren<{ className?: string }>) {
    return (
        <p className={`font-light text-xl text-gray-500 dark:text-gray-400 ${props.className}`}>
            {props.children}
        </p>
    );
}