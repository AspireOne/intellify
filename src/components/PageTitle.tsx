import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";
import Title from "./Title";

export default function PageTitle(props: PropsWithChildren<{className?: string, subtitle?: string}>) {
    return (
        <Title size={4} level={1} className={twMerge(`text-center mb-4 mt-14 ${props.className}`)}>
            {props.children}
        </Title>
    )
}