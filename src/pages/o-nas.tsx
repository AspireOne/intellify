import React from "react"
import {NextPage} from "next";
import {Par, Title} from "../components/article";

const AboutUs: NextPage = () => {
    return (
        <div className={"p-10 pt-0 text-gray-200 max-w-3xl mx-auto"}>
            <Title>O nás</Title>

            <Par>
                TODO: Finish this
                Jsme skupina nadšenců, která chtěla vzít nové možnosti v A.I.,
                a implementovat je do různých oblastí. Většinově nenabízíme hotový produkt, ale nástroje, které jsou specificky
                zaměřené na danou oblast, a které můžete využívat.
            </Par>
        </div>
    )
}
export default AboutUs;