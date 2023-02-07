import React from "react";
import {twMerge} from "tailwind-merge";

const IOCard = (props: React.PropsWithChildren<{title: string, id?: string, className?: string}>) => {
    return (
        <form id={props.id} className={twMerge(`shadow-lg bg-t-blue-500 whitespace-pre-wrap p-10 mx-auto ${props.className}`)}>
            <h3 className="text-3xl title-font text-center pb-7">{props.title}</h3>
            {props.children}
        </form>
    );
}
export default IOCard;