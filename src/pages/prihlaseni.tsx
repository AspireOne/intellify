import {NextPage} from "next";
import React, {useState} from "react";
import Button, {Style} from "../components/Button";
import GoogleLogo from "../../public/assets/google.png";
import {LogoApple} from "react-ionicons";
import {signIn, useSession} from "next-auth/react";
import axios from "axios";
import Popup from "../components/Popup";
import {useRouter} from "next/navigation";
import {trpc} from "../utils/trpc";

const Prihlaseni: NextPage = () => {
    const [type, setType] = React.useState<"login" | "register">("login");

    const {data: data, status} = useSession()
    // TODO: Redirect if logged in.

    if (status === "authenticated") {
        console.log("Signed in as " + (data?.user?.email));
    } else {
        console.log("authentication status: " + status);
    }

    const {data: session} = useSession();

    return (
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                     alt="logo"/>
                Open-Tools
            </a>
            <div
                className="w-full rounded-md shadow border md:mt-0 sm:max-w-lg xl:p-0 bg-t-alternative-700 border-gray-700">
                {/*Create two tabs - login and register. Do not use headless ui.*/}
                <div className={"flex flex-row"}> {/*TODO: border | border-b border-1*/}
                    <Button onClick={() => setType("login")}
                            className={"rounded-none rounded bg-transparent m-1 hover:bg-gray-500 hover:bg-opacity-40 p-3 w-full " + (type == "login" ? "bg-gray-600" : "")}>Přihlášení</Button>
                    <Button onClick={() => setType("register")}
                            className={"rounded-none rounded bg-transparent m-1 hover:bg-gray-500 hover:bg-opacity-40 p-3 w-full " + (type == "register" ? "bg-gray-600" : "")}>Registrace</Button>
                </div>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <Title type={type}/>
                    <ExternalLoginButtons/>
                    <OrDivider/>
                    <Form type={type}/>
                </div>
            </div>
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
                    className={"w-full px-2 border-gray-500 hover:border-gray-500 hover:bg-gray-300"}>
                <div className={"flex flex-row items-center justify-center gap-2"}>
                    <img src={GoogleLogo.src} width={"20px"} height={"auto"}/>
                    <span>Pokračovat přes Google</span>
                </div>
            </Button>
            <Button style={Style.OUTLINE}
                    className={"w-full px-2 border-gray-500 hover:border-gray-500 hover:bg-gray-300"}>
                <div className={"flex flex-row items-center justify-center gap-2"}>
                    <LogoApple color={"#fff"}/>
                    <span>Pokračovat přes Apple</span>
                </div>
            </Button>
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

const FormPasswordInput = (props: { type: "password" | "confirm", onChange: (value: string) => void }) => {
    return (
        <div>
            <label htmlFor={props.type}
                   className="block mb-2 text-sm font-medium text-white">{props.type == "password" ? "Heslo" : "Heslo znovu"}</label>
            <input type="password" name={props.type} placeholder="••••••••"
                   maxLength={50}
                   minLength={4}
                   onChange={(e) => props.onChange(e.target.value)}
                   className="outline-none border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                   required={true}/>
        </div>
    )
}

const FormEmailInput = (props: { onChange: (value: string) => void }) => {
    return (
        <div>
            <label htmlFor="email"
                   className="block mb-2 text-sm font-medium text-white">E-mail</label>
            <input type="email" name="email" id="email"
                   className="outline-none border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                   placeholder="jmeno@poskytovatel.cz"
                   maxLength={255}
                   onChange={(e) => props.onChange(e.target.value)}
                   required={true}/>
        </div>
    )
}

const FormHelperButtons = (props: { type: "login" | "register" }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start">
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
            {
                props.type == "login" &&
                <a href="#"
                   className="text-sm font-medium text-primary-600 hover:underline text-gray-300">Zapomněli jste
                    heslo?
                </a>
            }
        </div>
    )
}

const FormSubmitButton = (props: { type: "login" | "register", loading: boolean, onClick: (e: any) => void }) => {
    return (
        <Button
            onClick={props.onClick}
            loading={props.loading}
            className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5">
            {props.type == "login" ? "Přihlásit se" : "Registrovat se"}
        </Button>
    )
}

const Form = (props: { type: "login" | "register" }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const registerMutation = trpc.sign.register.useMutation();

    function showAlert(title: string, msg: string) {
        setPopupTitle(title);
        setPopupMessage(msg);
        setPopupOpen(true);
    }

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
            if (loginError) showAlert("Chyba", "Nepodařilo se přihlásit. " + loginError);
            else router.push('/');
            return;
        }

        try {
            await registerMutation.mutateAsync({email, password});
            const autoLoginError = await login(email, password);
            if (autoLoginError) showAlert("Chyba", "Nepodařilo se přihlásit. " + autoLoginError);
            else router.push('/');
        } catch (e: any) {
            showAlert("Chyba", "Nepodařilo se registrovat. " + e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Popup title={popupTitle} open={popupOpen} setOpen={setPopupOpen}>
                <p>{popupMessage}</p>
            </Popup>
            <form className="space-y-4">
                <FormEmailInput onChange={(val) => {
                    setEmail(val);
                    setEmailError(null);
                }}/>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <FormPasswordInput type={"password"} onChange={(val) => {
                    setPassword(val);
                    setPasswordError(null);
                }}/>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                {props.type == "register" && <FormPasswordInput type={"confirm"} onChange={(val) => {
                    setConfirmPassword(val);
                    setConfirmPasswordError(null);
                }}/>}
                {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                <FormHelperButtons type={props.type}/>
                <FormSubmitButton loading={loading} type={props.type} onClick={handleSubmit}/>
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
            console.log("Response is undefined - some error.");
            return "Něco se pokazilo. Zkuste to prosím později.";
        } else if (!response.ok) {
            console.log("Error logging in. Data: " + response.error);
            return response.error;
        } else {
            console.log("Successfully logged in.");
            return null;
        }
    }).catch((response) => {
        console.log("Error logging in. Data: " + response.error);
        return response.error;
    });
}

export default Prihlaseni;