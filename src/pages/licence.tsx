import React from "react"
import {NextPage} from "next";
import PageHeaderDiv from "../components/PageHeaderDiv";
import PageTitle from "../components/PageTitle";
import Subtitle from "../components/Subtitle";
import {ArticleDiv, ArticlePCard} from "../components/article";

const License: NextPage = () => {
    return (
        <ArticleDiv>
            <PageHeaderDiv>
                <PageTitle>
                    Licenční podmínky a autorská práva
                </PageTitle>
            </PageHeaderDiv>

            <ArticlePCard>
                <p>
                    Veškerý obsah generovaný pomocí A.I. na této stránce je čerpán ze zdrojů třetí strany. Autorská práva
                    se mohou u různých zdrojů lišit, ale ve většině případů obsah autorská práva postrádá.
                    Mezi takové se řadí i primární zdroj této stránky - OpenAI.
                    <br/><br/>
                    Obsah tedy můžete volně používat a šířit. Při šíření byste měli uvést jako zdroj název
                    sebe nebo vaší firmy.
                    <br/><br/>
                    Berte na vědomí, že obsah je uměle vygenerován -
                    může být chybný, lživý, závadný, nebo obsahovat nesmysly. Pokud jej budete prezentovat,
                    vždy si vygenerovaný text předem zkontrolujte.
                    <br/><br/>
                    Následující zásady byste měli dodržovat:
                    <ul>
                        <li>
                            <a href={"https://openai.com/policies/sharing-publication-policy"}>
                                OpenAI Zásady Sdílení a Zveřejňování
                            </a>
                        </li>
                        <li>
                            <a href={"https://openai.com/policies/usage-policies"}>
                                OpenAI Zásady Používání
                            </a>
                        </li>
                    </ul>
                </p>
            </ArticlePCard>
        </ArticleDiv>
    )
}
export default License;