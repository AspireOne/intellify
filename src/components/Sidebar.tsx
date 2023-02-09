import {NextPage} from "next";
import {
    Albums,
    Apps, Book,
    Chatbox, ChevronDown,
    ChevronDownOutline,
    Close,
    Code,
    Home,
    LogOut,
    Menu,
    People, Person,
    Search
} from "react-ionicons";
import React, {useEffect, useMemo, useState} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import {NextRouter, useRouter} from 'next/router';
import Link from "next/link";
import {useEventListener} from "@headlessui/react/dist/hooks/use-event-listener";
import {paths} from "../lib/constants";

const Sidebar: NextPage = () => {
    // (typeof localStorage !== "undefined" && localStorage.getItem("sidebar-open") == "true")
    const [isOpen, setIsOpen] = useState(false);
    const session = useSession();
    //const router = useRouter();

    useEffect(() => {
        const open = window.innerWidth > 768;
        setIsOpen(open);
        //localStorage.setItem("sidebar-open", open ? "true" : "false");
    }, []);

    return (
        <aside className={"z-10"}>
            <Menu color={"#fff"} height={"50px"} width={"50px"}
                  onClick={() => setIsOpen(!isOpen)}
                  title={"menu"}
                  cssClasses={`border border-gray-700 shadow-lg w-12 fixed top-5 left-4 cursor-pointer bg-t-blue-500 rounded-md p-2.5 ${isOpen ? "hidden" : ""}`}/>

            <div className={"h-screen fixed top-0 left-0 sm:sticky p-2 w-[250px] overflow-y-auto bg-t-blue-700 sm:bg-opacity-70 rounded-md shadow-2xl"
                + (isOpen ? "": " hidden")}>
                <div className={"relative h-full overflow-hidden"}>
                    <div className="text-xl text-gray-100">
                        <div className="p-2.5 mt-1 flex items-center">
                            <Apps width={"35px"} height={"35px"} color={"white"} cssClasses={"rounded-md bg-blue-600 p-1.5"} />
                            <h3 className="text-gray-200 text-md ml-3">Open Tools</h3>
                            <Close
                                color={"#fff"}
                                title={"close menu"}
                                cssClasses={"ml-9 cursor-pointer " /*+ "lg:hidden"*/}
                                onClick={() => setIsOpen(!isOpen)}/>
                        </div>
                        <div className="my-2 bg-gray-600 h-[1px]"></div>
                    </div>

                    <SearchBar/>

                    <Item title={"Domů"} icon={<Home color={"#fff"}/>} link={paths.index}/>
                    <Item title={"O nás"} icon={<People color={"#fff"}/>} link={paths.about}/>
                    <div className="my-4 bg-gray-600 h-[1px]"></div>

                    <Item title={"Tvoření prezentací"} icon={<Albums color={"#fff"}/>} link={paths.presentation}/>
                    <Item title={"Kódový asistent"} icon={<Code color={"#fff"}/>} link={paths.codeAssistant}/>
                    <Item title={"Obecné A.I."} icon={<Book color={"#fff"}/>} link={paths.generalAi}/>

{/*                    <Category title={"Chatbox"}>
                        <Item title={"Social"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                        <Item title={"Personal"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                        <Item title={"Friends"} icon={<Chatbox color={"#fff"}/>} link={"/"} />
                    </Category>*/}
                    <div className="my-4 bg-gray-600 h-[1px]"></div>

                    {
                        session.status == "authenticated" &&
                        <Item
                            title="Profil"
                            className={"absolute bottom-0 left-0 right-0"}
                            link={paths.profile}
                            icon={session.data.user?.image ? (<img width={25} height={"auto"} src={session.data.user?.image}/>) : <Person color={"#fff"}/>}/>
                    }
                    <Item title={session.status === "authenticated" ? "Odhlásit se" : "Přihlásit se"}
                          link={(session.status !== "authenticated" && paths.sign) || undefined}
                          onClick={session.status === "authenticated" ? (async () => await signOut()) : undefined}
                          icon={<LogOut color={"#fff"}/>}/>
                </div>
            </div>
        </aside>
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

// TODO: Add "float" bottom and top? Fot links vs action/functional buttons.
/**
 * @param props icon: Icon element.
 */
const Item = (props: {icon?: any, title: string, onClick?: () => void, className?: string, link?: string}) => {
    return <ListItem {...props} />;
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
            className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-100 cursor-pointer 
        bg-opacity-50 hover:bg-opacity-40 hover:bg-gray-500 text-white ${active && "bg-gray-500"} ${props.className}`}
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