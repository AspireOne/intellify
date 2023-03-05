import React from "react";
import {twMerge} from "tailwind-merge";

const Card = (props: React.PropsWithChildren<{className?: string, border?: boolean}>) => {
    return (
        <div className={twMerge(`p-4 text-gray-900 
        bg-white rounded-md shadow ${props.border && "border border-gray-600"} 
        dark:bg-t-alternative-700 dark:text-white ${props.className}`)}>
            {props.children}
        </div>
    )
}
export default Card;