import {NextPage} from "next";
import {
    Apps, Cart, ChevronBackOutline,
    ChevronDown,
    Close,
    Hammer,
    Home, LogIn,
    Menu,
    Person,
    Search
} from "react-ionicons";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {paths} from "../lib/constants";
import Ls from "../lib/ls";
import { twMerge } from "tailwind-merge";
import Skeleton from "react-loading-skeleton";
import {trpc} from "../lib/trpc";
import Utils from "../lib/utils";

enum ItemType { NORMAL, CATEGORY, PROFILE }

const Sidebar: NextPage = () => {
    const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
    const session = useSession();
    const {data} = trpc.user.getUser.useQuery(undefined, {
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        console.log("User id: ",  session.data?.user?.id);
        if (session.status === "authenticated") Ls.isSignedIn = true;
        if (session.status === "unauthenticated") Ls.isSignedIn = false;
    }, [session.status]);

    const [hasEverBeenSignedIn, setHasEverBeenSignedIn] = useState(false);
    useEffect(() => {
        setHasEverBeenSignedIn(Ls.hasEverBeenSignedIn);
    }, []);

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
                  cssClasses={`
                  z-10 border border-gray-700 shadow-lg w-12 fixed top-5 left-4 
                  cursor-pointer bg-t-blue-500 rounded-md p-2.5 ${isOpen && "hidden"}`}/>

            <aside onClick={() => {
                // Close by clicking outside of sidebar only on mobile.
                if (window.innerWidth <= 768) setIsOpen(false);
            }}
                   className={twMerge(`
                   sm:sticky sm:w-min w-full fixed top-0 bottom-0 sm:bg-transparent bg-black/50 z-10
                   ${isOpen === undefined ? "hidden sm:block" : (!isOpen && "hidden")} 
                   `)}
                   style={{ paddingTop: "env(safe-area-inset-top)", height: "calc(100vh - env(safe-area-inset-top))" }}>
                <div className={"sm:sticky p-2 w-[225px] bg-t-blue-700 h-full " +
                    "backdrop-blur-md sm:backdrop-blur-none bg-opacity-80 shadow-2xl"}
                >
                    <div className={"relative h-full overflow-hidden"}>
                        <div className="text-xl text-gray-100">
                            <div className="p-2.5 mt-1 flex items-center justify-between">
                                <div className="flex items-center">
                                    <img alt={"Logo"} width={"35px"} height={"35px"} src={"/assets/logo.png"} />
                                    <h3 className="text-gray-200 text-md ml-3">Intellify</h3>
                                </div>
                                <div className={"p-2 -mr-2 cursor-pointer " /*+ "lg:hidden"*/} onClick={() => setIsOpen(!isOpen)}>
                                    <ChevronBackOutline
                                        color={"#c0c0c0"}
                                        title={"Zavřít menu"}
                                    />
                                </div>
                            </div>
                            <div className="my-2 bg-gray-600 h-[1px]"></div>
                        </div>

                        {/*<SearchBar/>*/}

                        <ListItem text={"Domů"} icon={<Home color={"#fff"}/>} link={paths.index}/>
                        {/*<ListItem text={"Napište nám"} icon={<People color={"#fff"}/>} link={paths.contact}/>*/}
                        <ListItem text={"Ceník"} icon={<Cart color={"#fff"}/>} link={paths.pricing}/>
                        <ListItem text={"Nástroje"} icon={<Hammer color={"#fff"}/>} link={paths.tools}/>

                        {/*TODO: Fix that it shifts with navigation bar on mobile...;*/}
                        <div className={"absolute bottom-14 sm:bottom-0 left-0 right-0 "}>
                            {
                                (session.status === "loading" && hasEverBeenSignedIn) &&
                                <Skeleton height={45} className={"rounded-md"}/>
                            }
                            {
                                (session.status === "unauthenticated" || !hasEverBeenSignedIn) &&
                                <ListItem
                                    onClick={handleItemClick} text={hasEverBeenSignedIn ? "Přihásit se" : "Zaregistrovat se"}
                                    className={"bg-gray-200 bg-opacity-20"}
                                    link={paths.sign} icon={<LogIn color={"#fff"}/>}/>
                            }
                            {
                                session.status === "authenticated" &&
                                <ListItem
                                    text={session.data.user?.name || "Profil"}

                                    remaining={
                                    !data ? null : {
                                        freeTokens: data?.remainingFreeTokens ?? 0,
                                        subTokens: data?.subscription?.remainingTokens ?? 0
                                    }}
                                    link={paths.profile}
                                    icon={session.data.user?.image
                                        ? (<img
                                            alt={"Profilový obrázek"}
                                            className={"rounded-full"}
                                            width={35}
                                            height={"auto"}
                                            src={session.data.user?.image}/>)
                                        : <Person color={"#fff"}/>}/>
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
            className="p-2.5 flex items-center rounded-md px-4 cursor-pointer bg-gray-700 text-white"
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

const Category = (props: React.PropsWithChildren<{text: string}>) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div>
            <ListItem
                icon={<ChevronDown color={"#fff"}/>}
                text={props.text}
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

function ListItem(props: {icon?: any, text: string, className?: string, onClick?: () => void, link?: string,
    isCategoryItem?: boolean, alignBottom?: boolean, remaining?: {subTokens: number, freeTokens: number} | null}
) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActive(props.link === window?.location?.pathname);
        }
    }, [typeof window, typeof window != "undefined" && window?.location?.pathname]);

    // @ts-ignore
    const content = (
        <div
            className={twMerge(`p-2.5 mt-3 flex items-center rounded-md px-4 cursor-pointer 
        bg-opacity-50 hover:bg-opacity-40 hover:bg-gray-500 text-white ${active && "bg-gray-500"} ${props.className}`)}
            onClick={props.onClick}
        >
            {props.icon}
            <div className={"flex flex-col gap-1 ml-4 text-overflow: ellipsis;"}>
                <span className={`text-[${props.isCategoryItem ? 14 : 15}px] text-gray-200 font-bold whitespace-nowrap overflow-ellipsis overflow-x-hidden`}>
                    {props.text}
                </span>
                {
                    props.remaining !== undefined &&
                    <div className={"-mt-1 -ml-1 px-2 text-sm rounded-full bg-orange-400/20 text-gray-300"}>
                        {
                            props.remaining === null
                            ? <Skeleton className={"rounded-full"}/>
                            : `${Utils.tokensToWords(props.remaining?.subTokens + props.remaining?.freeTokens)} slov`
                        }
                    </div>
                }
            </div>
        </div>
    );

    return (
        <div>
            {props.link ? <Link href={props.link}>{content}</Link> : <>{content}</>}
        </div>
    );
}

export default Sidebar;