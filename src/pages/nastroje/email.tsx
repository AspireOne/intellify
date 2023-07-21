import {NextPage} from "next";
import PageHead from "../../components/PageHead";
import PageHeaderDiv from "../../components/PageHeaderDiv";
import React, {useState} from "react";
import Input from "../../components/Input";
import Button, {Style} from "../../components/Button";
import Card from "../../components/Card";
import {trpc} from "../../lib/trpc";
import {notifications} from "@mantine/notifications";
import {Select, Tooltip} from "@mantine/core";
import {CaretBackOutline, ChevronBackOutline, ChevronForwardOutline, Send} from "react-ionicons";
import Skeleton from "react-loading-skeleton";

type Info = {
    tone?: string,
    goal: string,
    pov?: string,
    information?: string,
}

type EditInfo = {
    subject: string,
    content: string,
    instruction: string
}

const EmailTool: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [screen, setScreen] = useState<"generator" | "editor">("generator");
    const [data, setData] = useState<{ content: string, subject: string } | undefined>();
    const [usedGenerationData, setUsedGenerationData] = useState<Info | undefined>();

    const createMailMutation = trpc.emailRouter.generateEmail.useMutation({
        onError: (error) => {
            setScreen("generator");
            notifications.show({
                title: 'Chyba při generování e-mailu',
                message: error.message,
                color: 'red',
            });
        },
        onSuccess: (data) => {
            setData(data);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const editMutation = trpc.emailRouter.editEmail.useMutation({
        onError: (error) => {
            notifications.show({
                title: 'Chyba při úpravě e-mailu',
                message: error.message,
                color: 'red',
            });
        },
        onSuccess: (data) => {
            setData(data);
        },
        onSettled: () => {
            setLoading(false);
        }
    });

    const onReadyToGenerate = (info: Info) => {
        setUsedGenerationData(info);
        setLoading(true);
        setScreen("editor");
        createMailMutation.mutate(info);
    };

    const onReadyToEdit = (info: EditInfo) => {
        setLoading(true);
        editMutation.mutate(info);
    }

    const onBackToGeneration = () => setScreen("generator");
    const onForwardToEdit = () => setScreen("editor");

    return (
        <div>
            <PageHead title={"E-Mail"} description={"TODO: description"}/>
            <PageHeaderDiv className={"text-center"}>
                <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-2">
                    Pište e-maily pomocí A.I.
                </h2>
                <p className={"text-gray-300"}>Nepřemýšlejte, JAK e-mail napsat. Soustřeďte se na sdělení.</p>
            </PageHeaderDiv>

            <Card border={true} className={"max-w-2xl mx-auto min-h-[31rem] relative"}>
                {
                    screen === "generator" &&
                    <GenerateEmailCard
                        data={usedGenerationData}
                        onReadyToSubmit={onReadyToGenerate}
                        handleForward={onForwardToEdit}/>
                }
                {
                    screen === "editor" &&
                    <EditEmailCard
                        loading={loading}
                        initialContent={data?.content}
                        initialSubject={data?.subject}
                        onReadyToSubmit={onReadyToEdit}
                        onBack={onBackToGeneration}/>
                }
            </Card>
        </div>
    );
};

function EditEmailCard(props: {
    initialSubject?: string,
    initialContent?: string,
    loading: boolean,
    onReadyToSubmit: (info: EditInfo) => void,
    onBack: () => void
}) {
    const [subject, setSubject] = useState(props.initialSubject);
    const [content, setContent] = useState(props.initialContent);
    const [editInstruction, setEditInstruction] = useState("");

    function handleSubmit() {
        if (editInstruction === "") {
            notifications.show({
                title: 'Instrukce pro úpravu musí být vyplněna',
                message: 'Pokud chcete zadat instrukci k úpravě, pole nesmí být prázné.',
                color: 'red',
            });
            return;
        }

        props.onReadyToSubmit({
            subject: subject ?? "",
            content: content ?? "",
            instruction: editInstruction
        });
    }

    return (
        <div className={"space-y-4 max-w-xl mx-auto sm:mt-0 mt-8"}>
            <NavigationButton pos={"left"} onClick={props.onBack}>
                Zpět na generátor
            </NavigationButton>
            {
                props.loading
                    ? <Skeleton className={"h-12 mb-8"}/>
                    : <Input theme={"gray"} label={"Předmět"} value={subject} onChange={setSubject}/>
            }
            {
                props.loading
                    ? <Skeleton className={"h-44"}/>
                    : <Input className={"max-h-[800px]"} theme={"gray"} label={"Obsah"} autosize={true} minRows={3}
                             value={content} onChange={setContent}/>
            }

            <div className={"h-[1px] bg-gray-300 dark:bg-gray-700 my-3"}></div>

            <div
                className={"rounded-md shadow-md bg-t-alternative-700 p-4 border border-gray-600 flex flex-row gap-4 items-end"}>
                <Input disabled={props.loading} theme={"gray"} label={"Upravit"} className={"max-h-[100px]"} autosize={true}
                       placeholder={"\"Zkrať začátek\"..."}
                       value={editInstruction} onChange={setEditInstruction}/>
                <Button disabled={props.loading} className={"w-14 h-[3.2rem] m-0"} onClick={handleSubmit}>
                    <Send color={"white"}/>
                </Button>
            </div>
        </div>
    )
}

function NavigationButton(props: {pos: "left" | "right", onClick: () => void, children: string}) {
    const size = "25px";

    return (
        <div className={`absolute ${props.pos === "left" ? "left-2" : "right-2"} top-3`}>
            <Tooltip label={props.children} withArrow={true} color={"gray"}>
                <button className={"p-0 m-0"}
                        onClick={props.onClick}>
                    {
                        props.pos === "left"
                        ? <ChevronBackOutline color={"white"} width={size} height={size}/>
                        : <ChevronForwardOutline color={"white"} width={size} height={size}/>
                    }
                </button>
            </Tooltip>
        </div>
    )
}

function GenerateEmailCard(props: { data?: Info, onReadyToSubmit: (info: Info) => void, handleForward: () => void }) {
    const [tone, setTone] = useState(props.data?.tone ?? "");
    const [goal, setGoal] = useState(props.data?.goal ?? "");
    const [pov, setPov] = useState(props.data?.pov ?? "");
    const [information, setInformation] = useState(props.data?.information ?? "");

    function handleSubmit() {
        if (!goal) {
            notifications.show({
                title: 'Některá povinná pole nejsou vyplněna',
                message: 'Vyplňte prosím všechna povinná pole.',
                color: 'red',
            });
            return;
        }

        props.onReadyToSubmit({
            tone: tone || undefined,
            goal: goal,
            pov: pov || undefined,
            information: information || undefined
        });
    }

    return (
        <div className={"space-y-4 max-w-xl mx-auto sm:mt-0 mt-8"}>
            {
                props.data &&
                <NavigationButton pos={"right"} onClick={props.handleForward}>
                    Zpět na úpravu
                </NavigationButton>
            }

            <Input
                theme={"gray"}
                label={"Cíl"}
                placeholder={"Prodloužit termín úkolu, informovat zákazníka o novém produktu..."}
                autosize={true}
                value={goal}
                onChange={(value) => setGoal(value)}
            />
            <Input
                theme={"gray"}
                label={"Vaše pozice (nepovinné)"}
                placeholder={"Student, zaměstnanec, firma Intellify..."}
                value={pov}
                onChange={(value) => setPov(value)}
            />
            <Input
                theme={"gray"}
                label={"Dodatečné informace (nepovinné)"}
                placeholder={
                    "\"Potřebuju prodoužit termín odevzdání referátu do přístího týdne. Nestíhám, protože mám příliš práce.\""
                }
                autosize={true}
                minRows={3}
                value={information}
                onChange={(value) => setInformation(value)}
            />
            <Select
                label={"Tón (nepovinné)"}
                className={"text-md text-white font-normal"}
                placeholder={"Vyberte tón zprávy..."}
                data={[
                    {label: "Přátelský", value: "přátelský"},
                    {label: "Humorný", value: "humorný"},
                    {label: "Profesionální", value: "profesionální"},
                    {label: "Vážný", value: "vážný"},
                ]}
                value={tone}
                onChange={(val) => setTone(val ?? "")}
            />

            <div className={"flex flex-row justify-between gap-4"}>
                <Button className={"w-48"} onClick={handleSubmit}>
                    Vytvořit
                </Button>
            </div>
        </div>
    )
}

export default EmailTool;