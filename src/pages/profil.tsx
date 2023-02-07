import {NextPage} from "next";
import React, {useState} from "react";
import Button from "../components/Button";
import {getSession, useSession} from "next-auth/react";
import Input from "../components/Input";
import INPUT from "../lib/inputConstraints";
import {Person} from "react-ionicons";
import { motion } from "framer-motion";
import {trpc} from "../utils/trpc";
import Popup from "../components/Popup";

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
                    /*// Infinite animation that changes opacity.
                    animate={{opacity: [0.35, 0.5, 0.35]}}
                    transition={{duration: 1.2, ease: "easeInOut", repeat: Infinity}}*/
                >
                    {
                        session.data?.user?.image && <img className="rounded-full" src={session.data?.user?.image || ""} alt={"Profile picture"}/>
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

                {
                    dataChanged &&
                    <Button loadingText={"Ukládání..."} onClick={handleSave} loading={loading}>Uložit změny</Button>
                }
            </form>
            <Plans/>
        </div>
    );
}


const Plans = (props: {}) => {
    return (
        <section className="">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed
                        for business teams like yours</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Here at Open Tools we focus
                        on markets where technology, innovation, and capital can unlock long-term value and drive
                        economic growth.</p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    <div
                        className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                        <h3 className="mb-4 text-2xl font-semibold">Jednotlivec</h3>
                        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Nejlepší možnost pro
                            osobní využití a pro vás další projekt.</p>
                        <div className="flex justify-center items-baseline my-8">
                            <span className="mr-2 text-5xl font-extrabold">29Kč</span>
                        </div>
                        
                        <ul role="list" className="mb-8 space-y-4 text-left">
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Individual configuration</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>No setup, or hidden fees</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Team size: <span className="font-semibold">1 developer</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Premium support: <span className="font-semibold">6 months</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Free updates: <span className="font-semibold">6 months</span></span>
                            </li>
                        </ul>
                        <a href="#"
                           className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Get
                            started</a>
                    </div>
                    
                    <div
                        className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                        <h3 className="mb-4 text-2xl font-semibold">Jednorázově</h3>
                        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for multiple users, extended & premium support.</p>
                        <div className="flex justify-center items-baseline my-8">
                            <span className="mr-2 text-5xl font-extrabold">$99</span>
                            <span className="text-gray-500 dark:text-gray-400">/month</span>
                        </div>
                        
                        <ul role="list" className="mb-8 space-y-4 text-left">
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Individual configuration</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>No setup, or hidden fees</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Team size: <span className="font-semibold">10 developers</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Premium support: <span className="font-semibold">24 months</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Free updates: <span className="font-semibold">24 months</span></span>
                            </li>
                        </ul>
                        <a href="#"
                           className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Get
                            started</a>
                    </div>

                    <div
                        className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                        <h3 className="mb-4 text-2xl font-semibold">Firma</h3>
                        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large scale uses
                            and extended redistribution rights.</p>
                        <div className="flex justify-center items-baseline my-8">
                            <span className="mr-2 text-5xl font-extrabold">$499</span>
                            <span className="text-gray-500 dark:text-gray-400">/month</span>
                        </div>

                        <ul role="list" className="mb-8 space-y-4 text-left">
                            <li className="flex items-center space-x-3">

                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Individual configuration</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>No setup, or hidden fees</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Team size: <span className="font-semibold">100+ developers</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Premium support: <span className="font-semibold">36 months</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                
                                <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span>Free updates: <span className="font-semibold">36 months</span></span>
                            </li>
                        </ul>
                        <a href="#"
                           className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Get
                            started</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;