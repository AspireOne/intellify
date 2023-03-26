import React from "react";
import {twMerge} from "tailwind-merge";

export default function CheckmarkSvg(props: {className?: string}) {
    return (
        <svg
            className={twMerge("flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400", props.className)}
            fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"/>
        </svg>
    );
}