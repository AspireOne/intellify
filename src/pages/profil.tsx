import {NextPage} from "next";
import React, {useEffect, useState} from "react";
import Button, {Style} from "../components/Button";
import {signOut, useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";
import {trpc} from "../utils/trpc";
import Popup from "../components/Popup";
import {ArrowForward} from "react-ionicons";
import {Offer} from "../server/schemas/offers";
import {z} from "zod";
import Skeleton from "react-loading-skeleton";
import {twMerge} from "tailwind-merge";
import Link from "next/link";
import {paths} from "../lib/constants";

const Profile: NextPage = () =>  {
    const session = useSession();

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

    return (
        <div className={"relative"}>
            <Popup title={popupTitle} open={popupOpen} setOpen={setPopupOpen}>
                <p>{popupMessage}</p>
            </Popup>
            <h1 className={"text-4xl m-4"}>Profil</h1>

            {/*Profile pic*/}
            <form className={"flex flex-col gap-4 max-w-md my-3 mx-auto bg-t-alternative-700 p-6 rounded-md"}>
                <div
                    className={"w-24 h-24 rounded-full mx-auto"}
                >
                    {
                        user.data?.image
                            ? <img className="rounded-full" src={user.data?.image || ""} alt={"Profile picture"}/>
                            : <Skeleton className={"h-full w-full rounded-full"}/>
                    }
                </div>

                <div className={"flex flex-row flex-wrap gap-4"}>
                    <p className={"border border-[1px] border-gray-300 bg-gray-800 py-2 px-4 rounded-full"}>
                        Plán: {
                        user.data
                            ? (user.data.plan?.name ?? <>žádný | <Link className={"text-blue-300 hover:underline"} href={paths.subscription}>prohlédnout</Link></>)
                            : <Skeleton width={"100px"} className={"rounded-full"}/>
                    }
                    </p>

                    <p className={"border border-[1px] border-gray-300 bg-gray-800 py-2 px-4 rounded-full"}>
                        Zbývající tokeny: {
                        user.data
                            ? (user.data.remainingTokens || <>0 | <Link className={"text-blue-300 hover:underline"} href={paths.subscription}>dokoupit</Link></>)
                            : <Skeleton width={"30px"} className={"rounded-full"}/>
                    }
                    </p>
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
            </form>
        </div>
    );
}

const Card = (props: React.PropsWithChildren<{className?: string}>) => {
    return (
        <div className={twMerge(`flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 
        bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 
        xl:p-8 dark:bg-t-alternative-700 dark:text-white ${props.className}`)}>
            {props.children}
        </div>
    )
}

export default Profile;