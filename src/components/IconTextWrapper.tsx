import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

export default function IconTextWrapper(props: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={twMerge(`flex flex-row gap-4 items-center ${props.className}`)}>
            {props.children}
        </div>
    );
}