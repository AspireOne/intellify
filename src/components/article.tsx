import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

export const ArticleDiv = (props: PropsWithChildren<{ className?: string }>) => {
    return <div className={twMerge(`mx-auto max-w-3xl text-gray-300 ${props.className}`)}>
        {props.children}
    </div>;
}

export const ArticlePCard = (props: PropsWithChildren<{ className?: string }>) => {
    return <div className={twMerge(`rounded-lg bg-gray-900 p-4 ${props.className}`)}>
        {props.children}
    </div>
}

export const ArticlePTitle = (props: PropsWithChildren<{ className?: string }>) => {
    return <h1 className={twMerge(`text-2xl text-gray-300 font-bold mt-10 mb-3 ml-0 ${props.className}`)}>
        {props.children}
    </h1>;
}