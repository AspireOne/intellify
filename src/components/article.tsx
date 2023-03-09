import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

/**
 * Paragraph.
* */
export const ArticleDiv = (props: PropsWithChildren<{ className?: string }>) => {
    return <div className={twMerge(`mx-auto max-w-3xl ${props.className}`)}>
        {props.children}
    </div>;
}
export const Par = (props: PropsWithChildren<{ className?: string }>) => {
    return <p className={twMerge(`text-gray-100 ${props.className}`)}>
        {props.children}
    </p>;
}
export const ParTitle = (props: PropsWithChildren<{ className?: string }>) => {
    return <h1 className={twMerge(`text-2xl font-bold mt-10 mb-3 ml-0 ${props.className}`)}>
        {props.children}
    </h1>;
}