import {PropsWithChildren} from "react";

export default function PageHeaderDiv(props: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`mx-auto text-center max-w-screen-md mb-8 lg:mb-12 mt-14 ${props.className}`}>
            {props.children}
        </div>
    );
}