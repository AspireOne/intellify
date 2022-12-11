import React from "react";

const Spinner = (props: {className?: string}) => {
    return(
        <div className={`mx-auto border-4 border-white-600 rounded-full loader ${props.className ?? ""}`}/>
    );
}
export default Spinner;