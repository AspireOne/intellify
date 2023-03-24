import React, {useCallback} from "react"
import {NextPage} from "next";
import {useSession} from "next-auth/react";
import License from "./licence";
import {ArticleDiv, ArticlePTitle} from "../components/article";
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
import {trpc} from "../lib/trpc";
import {notifications} from "@mantine/notifications";

const Contact = (props: {isInFooter?: boolean | null}) => {
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [message, setMessage] = React.useState("");

    const [loading, setLoading] = React.useState(false);

    const contactMutation = trpc.contactUs.useMutation({
        onSuccess: async (msg, input) => {
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
            notifications.show({
                title: 'Odesláno!',
                message: 'Zpráva byla úspěšně odeslána. Odpovíme nejdříve, jak to bude možné.',
                color: 'green',
            })
            // TODO: Mantine notification.
        },
        onError: (err) => {
            notifications.show({
                title: 'Při odesílání zprávy nastala chyba',
                message: 'Zkuste to prosím později. Detail: ' + err.message,
                color: 'red',
            })
            /*console.error(JSON.parse(err.message)[0].message);*/
        },
        onSettled: () => setLoading(false)
    });

    const onSubmit = useCallback((e: React.MouseEvent) => {
        setLoading(true);
        contactMutation.mutate({email, phone, subject, message});
    }, [email, phone, subject, message]);

    return (
        <div className={"sm:mx-14"}>
            {
                !props.isInFooter &&
                <PageHeaderDiv>
                    <PageTitle>
                        Kontaktujte nás
                    </PageTitle>
                    <Subtitle>
                        Máte dotaz? Problém? Zájem o spolupráci? Můžete nás kdykoli kontaktovat.
                    </Subtitle>
                </PageHeaderDiv>
            }
            {
                props.isInFooter &&
                <div className={"mb-4 m-1"}>
                    <PageTitle className={"text-left"}>
                        Kontaktujte nás
                    </PageTitle>
                    <Subtitle className={"text-left"}>
                        Máte dotaz? Problém? Zájem o spolupráci? Můžete nás kdykoli kontaktovat.
                    </Subtitle>
                </div>
            }
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
                    <div className={"flex flex-col sm:flex-row gap-4"}>
                        <Input theme={"gray"} label={"Váš e-mail*"} placeholder={"jan.novak@seznam.cz"}
                        onChange={setEmail} value={email}/>
                        <Input theme={"gray"} label={"Vaše telefonní číslo (nepovinné)"} placeholder={"123 456 789"}
                        onChange={setPhone} value={phone}/>
                    </div>
                    <Input theme={"gray"} label={"Předmět"} placeholder={"Čeho se zpráva týká?"}
                    onChange={setSubject} value={subject}/>
                    <Input theme={"gray"} label={"Zpráva*"} maxLen={2000} autosize={true} placeholder={"Zpráva..."}
                    onChange={setMessage} value={message}/>
                    <Button loading={loading} loadingText={"Odesílání..."} onClick={onSubmit}>Odeslat</Button>
                </Form>
            </div>
        </div>
    )
}
export default Contact;