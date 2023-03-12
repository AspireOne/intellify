// form.tsx

import {twMerge} from "tailwind-merge";
import {PropsWithChildren} from "react";

export default function Form(props: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={twMerge(`p-6 text-gray-900 bg-white rounded-md shadow dark:bg-t-alternative-700 
        dark:text-white flex flex-col gap-5 ${props.className}`)}>
            {props.children}
        </div>
    )
}