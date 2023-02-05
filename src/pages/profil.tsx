import {NextPage} from "next";
import React from "react";
import Button from "../components/Button";
import {useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";

const Profile: NextPage = () =>  {
    const session = useSession();
    const [name, setName] = React.useState(session.data?.user?.name || "");
    const [email, setEmail] = React.useState(session.data?.user?.email || "");
    const [newPassword, setNewPassword] = React.useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = React.useState("");

    return (
        <div>
            <h1>Profile</h1>

            {/*Profile pic*/}
            <form className={"flex flex-col gap-4 max-w-md mx-auto"}>
                <Input label={"Jméno"} placeholder={"Vaše jméno a příjmení"}
                       maxLen={INPUT.name.max} minLen={INPUT.name.min} value={name}/>

                <Input label={"E-Mail"} placeholder={"Váš e-mail"}
                       maxLen={INPUT.email.max} value={email}/>

                <Input label={"Heslo"} placeholder={"Nové heslo"}
                       maxLen={INPUT.password.max} minLen={INPUT.password.min} value={newPassword}/>

                {
                    newPassword.length > 0 &&
                    <div className={"flex flex-col gap-2"}>
                        <Input label={"Heslo znovu"} placeholder={"Nové heslo znovu"}
                               maxLen={INPUT.password.max} minLen={INPUT.password.min} value={newPasswordRepeat}/>

                        <Button>Uložit nové heslo</Button>
                    </div>
                }
            </form>
        </div>
    );
}

export default Profile;