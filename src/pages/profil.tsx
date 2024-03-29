import {NextPage} from "next";
import React from "react";
import Button, {Style} from "../components/Button";
import {signOut, useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";
import {trpc} from "../lib/trpc";
import {ArrowForward} from "react-ionicons";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import {paths} from "../lib/constants";
import PageTitle from "../components/PageTitle";
import Form from "../components/Form";
import PageHeaderDiv from "../components/PageHeaderDiv";
import Utils from "../lib/utils";
import {notifications} from "@mantine/notifications";
import Ls from "../lib/ls";
import PageHead from "../components/PageHead";


const Profile: NextPage = () =>  {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [currentPassword, setCurrentPassword] = React.useState("");

    const [dataChanged, setDataChanged] = React.useState(false);
    const [error, setError] = React.useState<null | string>(null);
    const [loading, setLoading] = React.useState(false);

    const session = useSession();
    const user = trpc.user.getUser.useQuery();

    const dataChangeMutation = trpc.user.updateData.useMutation({
        onSuccess: async (msg, input) => {
            // TODO: Update the session and show session data. The update() API will be released aby day soon (1.4.2023).
            setDataChanged(false);

            notifications.show({
                title: 'Uloženo!',
                message: 'Vaše údaje byly úspěšně uloženy.',
                color: 'green',
            });
        },
        onError: (err) => {
            notifications.show({
                title: 'Při ukládání nastala chyba',
                message: 'Detail: ' + err.message,
                color: 'red',
            });
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
            <PageHead title={"Profil"}/>
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
                        <SubscriptionInfo></SubscriptionInfo>
                    </div>

                    {/*className={"border border-[0px] border-gray-300 py-2 px-4 rounded-full"}*/}
                    <div>
                        <p className={"text-gray-400 text-sm mb-1"}>Zbývající slova</p>
                        {
                            user.data
                                ? (Utils.tokensToWords(remainingTokens) || <>0 • <Link className={"text-blue-300 hover:underline"} href={paths.pricing}>dokoupit</Link></>)
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

                <Button style={Style.NONE} onClick={async () => {
                    Ls.isSignedIn = false;
                    await signOut();
                }} className={"flex gap-1 justify-end items-center flex-row p-0"}>
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

    function SubscriptionInfo() {
        let element;

        if (user.data?.subscription?.data.fullName) {
            element = (
                <Link className={"text-blue-300 hover:underline"} href={paths.pricing}>
                    {user.data.subscription.data.fullName}
                </Link>
            )
        } else {
            element = (
                <>
                    žádné • <Link className={"text-blue-300 hover:underline"} href={paths.pricing}>prohlédnout</Link>
                </>
            )
        }

        return (
            <p>{user.data ? element : <Skeleton width={"100px"} className={"rounded-full"}/>}</p>
        );
    }
}

export default Profile;