import React from "react"
import {NextPage} from "next";
import {ArticleDiv, Par, ParTitle} from "../components/article";
import PageTitle from "../components/PageTitle";

const AboutUs: NextPage = () => {
    return (
        <ArticleDiv>
            <PageTitle>O nás</PageTitle>
            <Par className={"max-w-3xl"}>
                TODO: Finish this
                Jsme skupina nadšenců, která chtěla vzít nové možnosti v A.I.,
                a implementovat je do různých oblastí. Většinově nenabízíme hotový produkt, ale nástroje, které jsou specificky
                zaměřené na danou oblast, a které můžete využívat.
            </Par>
        </ArticleDiv>
    )
}
export default AboutUs;