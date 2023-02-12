import {NextPage} from "next";
import React, {useState} from "react";
import Button, {Style} from "../components/Button";
import {signOut, useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";
import {trpc} from "../utils/trpc";
import Popup from "../components/Popup";
import {ArrowForward} from "react-ionicons";

const Profile: NextPage = () =>  {
    const session = useSession();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [dataChanged, setDataChanged] = React.useState(false);

    const [error, setError] = React.useState<null | string>(null);
    const [loading, setLoading] = React.useState(false);

    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    function showAlert(title: string, msg: string) {
        setPopupTitle(title);
        setPopupMessage(msg);
        setPopupOpen(true);
    }

    const dataChangeMutation = trpc.user.updateData.useMutation({
        onSuccess: async (msg, input) => {
            // TODO: Update the fucking session and show session data.
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
        if (session.status !== "authenticated")
            return;

        const nameChanged = (session.data?.user?.name || "") !== name;
        const emailChanged = (session.data?.user?.email || "") !== email;
        const passwordChanged = newPassword.length > 0;

        const changed = nameChanged || emailChanged || passwordChanged;

        setDataChanged(changed);
        window.onbeforeunload = () => changed || undefined;
    }, [name, email, newPassword]);

    React.useEffect(() => {
        if (session.status === "authenticated") {
            setName(session.data?.user?.name || "");
            setEmail(session.data?.user?.email || "");
        }
    }, [session.status]);

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
            password: newPassword,
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
                {/*TODO: Skeleton loader*/}
                <div
                    className={"w-24 h-24 rounded-full bg-gray-200 mx-auto"}
                >
                    {
                        session.data?.user?.image &&
                        <img className="rounded-full" src={session.data?.user?.image || ""} alt={"Profile picture"}/>
                    }
                </div>

                <Input theme={"gray"} readonly={true} label={"Jméno"} placeholder={"Vaše jméno a příjmení"} onChange={setName}
                       maxLen={INPUT.name.max} minLen={INPUT.name.min} value={name}/>

                <Input theme={"gray"} readonly={true} label={"E-Mail"} placeholder={"Váš e-mail"} onChange={setEmail}
                       maxLen={INPUT.email.max} value={email}/>

                <Input theme={"gray"} readonly={true} label={"Nové heslo"} placeholder={"Nové heslo"} onChange={setNewPassword}
                       maxLen={INPUT.password.max} minLen={INPUT.password.min} value={newPassword}/>

                {
                    newPassword.length > 0 &&
                    <div className={"flex flex-col gap-2"}>
                        <Input label={"Současné heslo"} placeholder={"Vaše stávající heslo"} onChange={setCurrentPassword}
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
            </form>
        </div>
    );
}

export default Profile;