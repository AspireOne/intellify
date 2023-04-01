import React, {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

/*const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"];*/
// TODO: Make it scale based on screen size.

export default function Title(props: PropsWithChildren<{ className?: string, size?: number,
    tag?: 1 | 2 | 3 | 4 | 5 | 6 | "none" }>) {
    const size = props.size ?? 3;
    const tag = props.tag ?? 2;

    const css = twMerge(`
    text-${size == 1 ? "" : size}xl ${size === 0 && "text-lg"} 
    tracking-tight leading-8 font-extrabold text-white ${props.className}`);
    let element: JSX.Element;

    switch (tag) {
        case 6: element = <h6 className={css}>{props.children}</h6>;
            break;
        case 5: element = <h5 className={css}>{props.children}</h5>;
            break;
        case 4: element = <h4 className={css}>{props.children}</h4>;
            break;
        case 3: element = <h3 className={css}>{props.children}</h3>;
            break;
        case 2: element = <h2 className={css}>{props.children}</h2>;
            break;
        case 1: element = <h1 className={css}>{props.children}</h1>;
            break;
        case "none": element = <p className={css}>{props.children}</p>;
            break;
    }
    return element;
}