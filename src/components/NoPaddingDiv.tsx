// A wrapper for div react component.

import {DetailedHTMLProps, HTMLAttributes, PropsWithChildren} from "react";

export default function NoPaddingDiv(props: PropsWithChildren<{className?: string, style?: any }>) {
    return (
        <div style={props.style} className={`-m-3 sm:-m-5 ${props.className}`}>
            {props.children}
        </div>
    );
}