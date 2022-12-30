import React from "react";

const IOCard = (props: React.PropsWithChildren<{title: string}>) => {
    return (
        <form className="rounded-md shadow-lg bg-t-blue-500 whitespace-pre-wrap p-10 mx-auto">
            <h3 className="text-3xl title-font text-center pb-7">{props.title}</h3>
            {props.children}
        </form>
    );
}
export default IOCard;