import React from "react";

const Button = (props: React.PropsWithChildren<{}>) => {
    return <button>{props.children}</button>;
}