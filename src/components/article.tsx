import {PropsWithChildren} from "react";

export const Par = (props: PropsWithChildren) => <p className={"text-gray-300"}>{props.children}</p>
export const Title = (props: PropsWithChildren) => <h1 className={"text-2xl font-bold mt-10 mb-3 ml-0"}>{props.children}</h1>