import React from "react"
import {NextPage} from "next";
import {useSession} from "next-auth/react";
import License from "./licence";
import {ArticleDiv, ParTitle} from "../components/article";
import PageTitle from "../components/PageTitle";

const Contact: NextPage = () => {
    const session = useSession();

    return (
        <ArticleDiv>
            <PageTitle>Kontaktujte nás</PageTitle>

        </ArticleDiv>
    )
}
export default Contact;