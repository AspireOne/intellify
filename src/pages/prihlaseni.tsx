import {NextPage} from "next";
import React, {useEffect, useState} from "react";
import Button, {Style} from "../components/Button";
import GoogleLogo from "../../public/assets/google.png";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {trpc} from "../lib/trpc";
import {paths} from "../lib/constants";
import Input from "../components/Input";
import Ls from "../lib/ls";
import Card from "../components/Card";
import PageHead from "../components/PageHead";

// TODO: Save logged in status to localstorage, and when a page loads and session status is loading,
// TODO: temporarily take the login status from localstorage until session loads. Make it an abstraction.
const Sign: NextPage = () => {
    const [type, setType] = React.useState<"login" | "register">("register");

    // useeffect when localstorage is available.
    useEffect(() => {
        if (typeof localStorage !== "undefined") setType(Ls.hasEverBeenSignedIn ? "login" : "register");
    }, [typeof localStorage]);

    return (
        <div className="flex flex-col items-center justify-center mx-auto h-screen lg:py-0 my-4">
            <PageHead title={"Přihlášení"} description={"Přihlašovací stránka do Open Tools. Zrychlete svůj workflow pomocí A.I. nástrojů."}/>
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                     alt="logo"/>
                Open-Tools
            </a>
            <Card
                className="w-full rounded-md shadow border md:mt-0 sm:max-w-lg xl:p-0 bg-t-alternative-700 border-gray-700">
                {/*Create two tabs - login and register. Do not use headless ui.*/}
                <div className={"flex flex-row"}> {/*TODO: border | border-b border-1*/}
                    <Button style={Style.NONE} onClick={() => setType("login")}
                            className={"rounded m-1 hover:bg-gray-500/40 p-3 w-full " + (type == "login" ? "bg-gray-600" : "")}>Přihlášení</Button>
                    <Button style={Style.NONE} onClick={() => setType("register")}
                            className={"rounded m-1 hover:bg-gray-500/40 p-3 w-full " + (type == "register" ? "bg-gray-600" : "")}>Registrace</Button>
                </div>
                <div className="pt-6 space-y-4 md:space-y-6 sm:p-8">
                    <Title type={type}/>
                    <ExternalLoginButtons/>
                    <OrDivider/>
                    <Form type={type}/>
                </div>
            </Card>
        </div>
    )
}

const ExternalLoginButtons = () => {
    return (
        <div className={"flex flex-col sm:flex-row gap-4 text-gray-400 font-bold"}>
            <Button style={Style.OUTLINE}
                    onClick={async () => {
                        const result = await signIn("google", {redirect: false});
                        if (result?.ok) {
                            // TODO: Route to somewhere.
                        }

                    }}
                    className={"w-full px-2 py-3 bg-transparent border-gray-500 hover:border-gray-500 hover:bg-gray-300"}>
                <div className={"flex flex-row items-center justify-center gap-2"}>
                    <img src={GoogleLogo.src} width={"20px"} height={"auto"}/>
                    <span>Pokračovat přes Google</span>
                </div>
            </Button>

            {/*<Button style={Style.OUTLINE}
                    className={"w-full px-2 border-gray-500 hover:border-gray-500 hover:bg-gray-300"}>
                <div className={"flex flex-row items-center justify-center gap-2"}>
                    <LogoApple color={"#fff"}/>
                    <span>Pokračovat přes Apple</span>
                </div>
            </Button>*/}
        </div>
    );
}

const OrDivider = () => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="h-[2px] w-full bg-gray-700"/>
            <div className="relative px-4 text-sm text-gray-500 text-gray-400">nebo</div>
            <div className="h-[2px] w-full bg-gray-700"/>
        </div>
    );
}

const Title = (props: { type: "login" | "register" }) => {
    return (
        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            {props.type == "login" ? "Vítejte zpět" : "Připojte se k nám"}
        </h1>
    );
}

const FormHelperButtons = (props: { type: "login" | "register" }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start">
                {/*TODO: Implement "remember?"*/}
                {
                    props.type == "login" &&
                    <div className="flex items-center h-5">
                        <input id="remember" aria-describedby="remember" type="checkbox"
                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"
                               required={true}/>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-300">Zapamatovat</label>
                        </div>
                    </div>
                }
            </div>
            {/*TODO: Implement "forgot password?"*/}
            {/*{
                props.type == "login" &&
                <a href="#"
                   className="text-sm font-medium text-primary-600 hover:underline text-gray-300">Zapomněli jste
                    heslo?
                </a>
            }*/}
        </div>
    )
}

const FormSubmitButton = (props: { type: "login" | "register", loading: boolean, onClick: (e: any) => void }) => {
    return (
        <Button
            onClick={props.onClick}
            loading={props.loading}
            loadingText={props.type == "login" ? "Přihlašování..." : "Registrování..."}
            className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5">
            {props.type == "login" ? "Přihlásit se" : "Registrovat se"}
        </Button>
    )
}

const Form = (props: { type: "login" | "register" }) => {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);

    const [name, setName] = useState("");

    const [surname, setSurname] = useState("");

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const registerMutation = trpc.sign.register.useMutation();

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);
        let inputError = false;

        if (props.type == "register" && password !== confirmPassword) {
            setConfirmPasswordError("Hesla se neshodují.");
            inputError = true;
        }

        if (password.length < 4) {
            setPasswordError("Heslo musí mít alespoň 4 znaky.");
            inputError = true;
        }

        if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            setEmailError("Email není správný.");
            inputError = true;
        }

        if (inputError) {
            setLoading(false);
            return;
        }

        if (props.type === "login") {
            const loginError = await login(email, password);
            setLoading(false);
            if (loginError) setLoginError("Nepodařilo se přihlásit. " + loginError);
            else router.push(paths.index);
            return;
        }

        try {
            await registerMutation.mutateAsync({email, password, name, surname});
            Ls.isSignedIn = true;
            const autoLoginError = await login(email, password);
            if (autoLoginError) setRegisterError("Registrace byla úspěšná, ale nepodařilo se přihlásit. Zkuste to prosím později. " + autoLoginError);
            else router.push(paths.index);
        } catch (e: any) {
            setRegisterError("Nepodařilo se registrovat. Zkuste to prosím později. " + e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form className="space-y-4">
                {
                    props.type === "register" &&
                    <div className={"flex flex-row gap-4"}>
                        <Input theme={"gray"} label={"Jméno"}
                               placeholder={"Jméno (nepovinné)"} maxLen={30}
                               onChange={setName} value={name}/>
                        <Input theme={"gray"} label={"Přijmení"}
                               placeholder={"Přijmení (nepovinné)"} maxLen={30}
                               onChange={setSurname} value={surname}/>
                    </div>
                }

                <Input theme={"gray"} label={"E-Mail"} placeholder="jmeno@poskytovatel.cz"
                       maxLen={255} onChange={(val) => {
                    setEmail(val);
                    setEmailError(null);
                       }} error={emailError} />

                <Input theme={"gray"} label={"Heslo"} type={"password"} placeholder={"Vaše heslo"} maxLen={100} minLen={4} error={passwordError}
                       onChange={(val) => {
                           setPassword(val);
                           setPasswordError(null);
                       }}
                />

                {
                    props.type == "register" &&
                    <Input theme={"gray"} label={"Heslo znovu"} type={"password"} placeholder={"Heslo znovu"} maxLen={100} minLen={4} error={confirmPasswordError}
                           onChange={(val) => {
                               setConfirmPassword(val);
                               setConfirmPasswordError(null);
                           }}
                    />
                }
                <FormHelperButtons type={props.type}/>
                <FormSubmitButton loading={loading} type={props.type} onClick={handleSubmit}/>
                {props.type === "login" && loginError && <p className="text-red-500 text-md">{loginError}</p>}
                {props.type === "register" && registerError && <p className="text-red-500 text-md">{registerError}</p>}
            </form>
        </>
    )
}

/**@returns null if there is no error, string with the error message if there is an error, or empty string if there is
 * an error but no error message.*/
function login(email: string, password: string): Promise<string | null> {
    return signIn("credentials", {
        email: email,
        password: password,
        redirect: false
    }).then((response) => {
        if (!response) {
            console.error("Response is undefined - some error.");
            return "Něco se pokazilo. Zkuste to prosím později.";
        } else if (!response.ok) {
            console.error("Error logging in. Data: " + response.error);
            return response.error;
        } else {
            console.log("Successfully logged in.");
            return null;
        }
    }).catch((response) => {
        console.error("Error logging in. Data: " + response.error);
        return response.error;
    });
}

export default Sign;