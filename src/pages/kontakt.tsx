import React, {useCallback} from "react"
import {NextPage} from "next";
import {useSession} from "next-auth/react";
import License from "./licence";
import {ArticleDiv, ParTitle} from "../components/article";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";
import INPUT from "../lib/inputConstraints";
import Input from "../components/Input";
import Form from "../components/Form";
import Title from "../components/Title";
import Button from "../components/Button";
import {Call, MailOpen} from "react-ionicons";
import IconTextWrapper from "../components/IconTextWrapper";
import Subtitle from "../components/Subtitle";
import PageHeaderDiv from "../components/PageHeaderDiv";

const Contact: NextPage = () => {
    const session = useSession();

    const onInputChange = useCallback((val: string) => {

    }, []);

    return (
        <div className={"sm:mx-14"}>
            <PageHeaderDiv>
                <PageTitle>
                    Kontaktujte nás
                </PageTitle>
                <Subtitle>
                    Pokud máte jakékoliv dotazy, nebo máte zájem o spolupráci, neváhejte nás kontaktovat.
                </Subtitle>
            </PageHeaderDiv>
            <div className={"flex flex-row gap-4 flex-wrap lg:flex-nowrap justify-center"}>
                <Card className={"flex flex-col gap-4 p-6 w-full lg:w-min"}>
                    <Title size={1}>Kontaktní informace</Title>
                    <IconTextWrapper>
                        <Call color={"#fff"} width={"20px"}/>
                        <a href="tel:+420732175490">+420 732 175 490</a>
                    </IconTextWrapper>
                    <IconTextWrapper>
                        <MailOpen color={"#fff"} width={"20px"}/>
                        <a href={"mailto:matejpesl1@gmail.com"}>matejpesl1@gmail.com</a>
                    </IconTextWrapper>
                </Card>
                <Form className={"flex-1 min-w-fit max-w-5xl"}>
                    <div className={"flex sm:flex-row gap-4"}>
                        <Input theme={"gray"} label={"Váš e-mail*"} placeholder={"jan.novak@seznam.cz"}/>
                        <Input theme={"gray"} label={"Vaše telefonní číslo"} placeholder={"123 456 789"}/>
                    </div>
                    <Input theme={"gray"} label={"Předmět"} placeholder={"Čeho se zpráva týká?"}
                           onChange={onInputChange}/>
                    <Input theme={"gray"} label={"Zpráva*"} maxLen={2000} autosize={true} placeholder={"Zpráva..."}/>
                    <Button>Odeslat</Button>
                </Form>
            </div>
        </div>
    )
}
export default Contact;