import {NextPage} from "next";
import {
    Apps, Cart,
    ChevronDown,
    Close,
    Hammer,
    Home, LogIn,
    Menu,
    People, Person,
    Search
} from "react-ionicons";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {paths} from "../lib/constants";
import Ls from "../lib/ls";
import { twMerge } from "tailwind-merge";
import Skeleton from "react-loading-skeleton";

const Sidebar: NextPage = () => {
    // (typeof localStorage !== "undefined" && localStorage.getItem("sidebar-open") == "true")
    const [isOpen, setIsOpen] = useState(false);
    const session = useSession();

    useEffect(() => {
        const open = window.innerWidth > 768;
        setIsOpen(open);
        //localStorage.setItem("sidebar-open", open ? "true" : "false");
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth <= 768) setIsOpen(false);
    }, [typeof window, typeof window != "undefined" && window?.location?.pathname]);

    const handleItemClick = () => {
        if (window.innerWidth <= 768) setIsOpen(false);
    }

    return (
        /*An opaque dark div that will span the whole screen.*/
        <>
            <Menu color={"#fff"} height={"50px"} width={"50px"}
                  onClick={() => setIsOpen(!isOpen)}
                  title={"menu"}
                  cssClasses={`border border-gray-700 shadow-lg w-12 fixed top-5 left-4 cursor-pointer bg-t-blue-500 rounded-md p-2.5 ${isOpen && "hidden"}`}/>

            <aside onClick={() => {
                // Close by clicking outside of sidebar only on mobile.
                if (window.innerWidth <= 768) setIsOpen(false);
            }}
                   className={`sm:sticky sm:w-min w-full fixed top-0 left-0 h-full sm:bg-transparent bg-black/50 z-10 ${!isOpen ? "hidden" : ""}`}>

                {/*TODO: Close sidebar when outside of sidebar is clicked.*/}
                <div className={"h-screen fixed top-0 left-0 sm:sticky p-2 w-[250px] overflow-y-auto bg-t-blue-700 " +
                    "backdrop-blur-md sm:backdrop-blur-none bg-opacity-80 shadow-2xl"}>
                    <div className={"relative h-full overflow-hidden"}>
                        <div className="text-xl text-gray-100">
                            <div className="p-2.5 mt-1 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Apps width={"35px"} height={"35px"} color={"white"} cssClasses={"rounded-md bg-blue-600 p-1.5"} />
                                    <h3 className="text-gray-200 text-md ml-3">Open Tools</h3>
                                </div>
                                <div className={"p-2 -mr-2 cursor-pointer " /*+ "lg:hidden"*/} onClick={() => setIsOpen(!isOpen)}>
                                    <Close
                                        color={"#fff"}
                                        title={"Zavřít menu"}
                                    />
                                </div>
                            </div>
                            <div className="my-2 bg-gray-600 h-[1px]"></div>
                        </div>

                        <SearchBar/>

                        <ListItem title={"Domů"} icon={<Home color={"#fff"}/>} link={paths.index}/>
                        {/*<ListItem title={"Napište nám"} icon={<People color={"#fff"}/>} link={paths.contact}/>*/}
                        {/*TODO: Change icon.*/}
                        <ListItem title={"Ceník"} icon={<Cart color={"#fff"}/>} link={paths.pricing}/>
                        <ListItem title={"Nástroje"} icon={<Hammer color={"#fff"}/>} link={paths.tools}/>
                        {/*<div className="my-4 bg-gray-600 h-[1px]"></div>*/}
                        {/*<ListItem title={"Tvoření prezentací"} icon={<Albums color={"#fff"}/>} link={paths.presentation}/>
                        <ListItem title={"Kódový asistent"} icon={<Code color={"#fff"}/>} link={paths.codeAssistant}/>
                        <ListItem title={"Obecné A.I."} icon={<Book color={"#fff"}/>} link={paths.generalAi}/>*/}

                        {/*                    <Category title={"Chatbox"}>
                        <ListItem title={"Social"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                        <ListItem title={"Personal"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                        <ListItem title={"Friends"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                    </Category>*/}
                        {/*<div className="my-4 bg-gray-600 h-[1px]"></div>*/}

                        <div className={"absolute bottom-0 left-0 right-0"}>
                            {
                                session.status === "loading" &&
                                <Skeleton height={45} className={"rounded-full"}/>
                            }
                            {
                                session.status === "authenticated" &&
                                <ListItem
                                    title={session.data.user?.name || "Profil"}
                                    className={"rounded-full"}
                                    link={paths.profile}
                                    icon={session.data.user?.image
                                        ? (<img
                                            className={"rounded-full"}
                                            width={25}
                                            height={"auto"}
                                            src={session.data.user?.image}/>)
                                        : <Person color={"#fff"}/>}/>
                            }
                            {
                                session.status === "unauthenticated" &&
                                <ListItem
                                    onClick={handleItemClick} title={Ls.hasBeenSigned ? "Přihásit se" : "Zaregistrovat se"}
                                    className={"rounded-full bg-gray-200 bg-opacity-20"}
                                    link={paths.sign} icon={<LogIn color={"#fff"}/>}/>
                            }
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

const SearchBar = () => {
    return (
        <div
            className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
        >
            <Search cssClasses="text-sm" color={"#e7e7e7"}/>
            <input
                type="text"
                placeholder="Hledat"
                className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
            />
        </div>
    );
}

const Category = (props: React.PropsWithChildren<{title: string}>) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div>
            <ListItem
                icon={<ChevronDown color={"#fff"}/>}
                title={props.title}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <div
                className={"mx-auto mt-1 w-4/5 text-left text-sm font-bold text-gray-200" + (isDropdownOpen ? "" : " hidden")}
            >
                {props.children}
            </div>
        </div>
    );
}

const ListItem = (props: {icon?: any, title: string, className?: string, onClick?: () => void, link?: string, isCategoryItem?: boolean, alignBottom?: boolean}) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActive(props.link === window?.location?.pathname);
        }
    }, [typeof window, typeof window != "undefined" && window?.location?.pathname]);

    // @ts-ignore
    const content = (
        <div
            className={twMerge(`p-2.5 mt-3 flex items-center rounded-md px-4 duration-100 cursor-pointer 
        bg-opacity-50 hover:bg-opacity-40 hover:bg-gray-500 text-white ${active && "bg-gray-500"} ${props.className}`)}
            onClick={props.onClick}
        >
            {props.icon}
            <span className={`text-[${props.isCategoryItem ? 14 : 15}px] ml-4 text-gray-200 font-bold`}>{props.title}</span>
        </div>
    );

    return (
        <div>
            {props.link ? <Link href={props.link}>{content}</Link> : <>{content}</>}
        </div>
    );
}

export default Sidebar;