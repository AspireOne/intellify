import React, {PropsWithChildren} from "react";

export default function PageTitle(props: PropsWithChildren) {
    return (
        <h1 className="text-center m-8 mt-14 text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            {props.children}
        </h1>
    )
}