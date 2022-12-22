import React from "react";

const IOCard = (props: React.PropsWithChildren<{title: string}>) => {
    return (
        <form className="relative rounded-md shadow-md bg-darkish-blue py-2 whitespace-pre-wrap px-10 py-10">
            <h3 className="text-2xl font-bold text-center pb-5">{props.title}</h3>
            {props.children}
        </form>
    );
}
export default IOCard;