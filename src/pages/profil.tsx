import {NextPage} from "next";
import React, {useState} from "react";
import Button, {Style} from "../components/Button";
import {signOut, useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";
import {trpc} from "../utils/trpc";
import Popup from "../components/Popup";
import {ArrowForward} from "react-ionicons";
import Skeleton from "react-loading-skeleton";
import {twMerge} from "tailwind-merge";
import Link from "next/link";
import {paths} from "../lib/constants";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";
import Form from "../components/Form";
import PageHeaderDiv from "../components/PageHeaderDiv";

const Profile: NextPage = () =>  {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [currentPassword, setCurrentPassword] = React.useState("");

    const [dataChanged, setDataChanged] = React.useState(false);
    const [error, setError] = React.useState<null | string>(null);
    const [loading, setLoading] = React.useState(false);

    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    const user = trpc.user.getUser.useQuery();

    function showAlert(title: string, msg: string) {
        setPopupTitle(title);
        setPopupMessage(msg);
    }

    const dataChangeMutation = trpc.user.updateData.useMutation({
        onSuccess: async (msg, input) => {
            // TODO: Update the fucking session and show session data.
            setDataChanged(false);
        },
        onError: (err) => {
            showAlert("Chyba", "Nastala chyba: " + err.message);
            setError(err.message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    React.useEffect(() => {
        if (user.data) {
            setName(user.data.name || "");
            setEmail(user.data.email);
        }
    }, [user.data]);

    function handleSave() {
        setLoading(true);

        if (!dataChanged) {
            setError("Nejprve musíte provést změny.");
            setLoading(false);
            return;
        }

        dataChangeMutation.mutate({
            name,
            email,
            password: password,
        });
    }

    let remainingTokens = 0;
    if (user.data) {
        remainingTokens += user.data.remainingFreeTokens;
        if (user.data.subscription) remainingTokens += user.data.subscription.remainingTokens;
    }

    return (
        <div className={"relative"}>
            <Popup title={popupTitle} open={popupOpen} setOpen={setPopupOpen}>
                <p>{popupMessage}</p>
            </Popup>
            <PageHeaderDiv>
                <PageTitle>Váš profil</PageTitle>
            </PageHeaderDiv>

            {/*Profile pic*/}
            <Form className={"max-w-lg mx-auto"}>
                <div
                    className={"w-24 h-24 rounded-full mx-auto"}
                >
                    {
                        user.data?.image
                            ? <img className="rounded-full" src={user.data?.image || ""} alt={"Profile picture"}/>
                            : <Skeleton circle={true} className={"h-full w-full"}/>
                    }
                </div>

                <div className={"flex flex-row flex-wrap gap-12 mx-auto"}>
                    {/*className={"border border-[0px] border-gray-300 py-2 px-4 rounded-full"}*/}
                    <div>
                        <p className={"text-gray-400 text-sm mb-1"}>Předplatné</p>
                        <p>
                            {
                                user.data
                                    ? (user.data.subscription?.data.name ?? <>žádné • <Link className={"text-blue-300 hover:underline"} href={paths.pricing}>prohlédnout</Link></>)
                                    : <Skeleton width={"100px"} className={"rounded-full"}/>
                            }
                        </p>
                    </div>

                    {/*className={"border border-[0px] border-gray-300 py-2 px-4 rounded-full"}*/}
                    <div>
                        <p className={"text-gray-400 text-sm mb-1"}>Zbývající tokeny</p>
                        {
                        user.data
                            ? (remainingTokens || <>0 • <Link className={"text-blue-300 hover:underline"} href={paths.pricing}>dokoupit</Link></>)
                            : <Skeleton width={"100px"} className={"rounded-full"}/>
                        }
                    </div>
                </div>

                <Input loading={!user.data} theme={"gray"} label={"Jméno"} placeholder={"Vaše jméno a příjmení"}
                       onChange={(val) => {setName(val); setDataChanged(true);}}
                       maxLen={INPUT.name.max} minLen={INPUT.name.min} value={name}/>

                <Input loading={!user.data} theme={"gray"} readonly={true} label={"E-Mail"} placeholder={"Váš e-mail"}
                       onChange={(val) => {setEmail(val); setDataChanged(true);}}
                       maxLen={INPUT.email.max} value={email}/>

                {
                    user.data?.hasPassword &&
                    <Input loading={!user.data} theme={"gray"} label={"Nové heslo"} placeholder={"Nové heslo"}
                           onChange={(val) => {setPassword(val); setDataChanged(true);}}
                           maxLen={INPUT.password.max} minLen={INPUT.password.min} value={password}/>
                }

                {
                    password.length > 0 &&
                    <div className={"flex flex-col gap-2"}>
                        <Input loading={!user.data} theme={"gray"} label={"Současné heslo"} placeholder={"Vaše stávající heslo"} onChange={setCurrentPassword}
                               maxLen={INPUT.password.max} minLen={INPUT.password.min} value={currentPassword}/>
                    </div>
                }

                <Button style={Style.NONE} onClick={() => signOut()} className={"flex gap-1 justify-end items-center flex-row p-0"}>
                    Odhlásit se
                    <ArrowForward color={"#fff"} height={"18px"}/>
                </Button>

                {
                    dataChanged &&
                    <Button loadingText={"Ukládání..."} onClick={handleSave} loading={loading}>Uložit změny</Button>
                }
                {error && <p className={"text-red-500"}>{error}</p>}
            </Form>
        </div>
    );
}

export default Profile;