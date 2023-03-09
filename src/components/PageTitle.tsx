import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

export default function PageTitle(props: PropsWithChildren<{className?: string}>) {
    return (
        <h1 className={twMerge(`text-center m-8 mt-14 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white ${props.className}`)}>
            {props.children}
        </h1>
    )
}