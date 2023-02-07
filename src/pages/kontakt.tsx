import React from "react"
import {NextPage} from "next";
import {useSession} from "next-auth/react";
import License from "./licence";

const Contact: NextPage = () => {
    const session = useSession();

    return (
        <div>
            <h1>Kontakt</h1>

            todo - implement contact page
        </div>
    )
}
export default Contact;