import {NextPage} from "next";
import {
    Albums,
    Apps,
    Book, Chatbox,
    ChevronDownOutline,
    Close, Code,
    Home,
    InformationCircle, LogOut,
    Menu,
    People,
    Search
} from "react-ionicons";
import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom"
import {twMerge} from "tailwind-merge";

// TODO: pass in the websites + the active one?
const Sidebar: NextPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(window.innerWidth > 768);
    }, []);

    return (
        <aside className={"z-10"}>
            <Menu color={"#fff"} height={"50px"} width={"50px"}
                  onClick={() => setIsOpen(!isOpen)}
                  title={"menu"}
                  cssClasses={"w-12 fixed top-5 left-4 cursor-pointer bg-t-blue-500 rounded-md p-2.5"}/>

            <div className={"h-screen fixed sm:sticky top-0 bottom-0 lg:left-0 p-2 w-[250px] overflow-y-auto text-center bg-t-blue-700 rounded-md shadow-2xl"
                + (isOpen ? "": " hidden")}>
                <div className="text-xl text-gray-100">
                    <div className="p-2.5 mt-1 flex items-center">
                        <Apps width={"35px"} height={"35px"} color={"white"} cssClasses={"rounded-md bg-blue-600 p-1.5"} />
                        <h3 className="text-gray-200 text-md ml-3">Open Tools</h3>
                        <Close
                            color={"#fff"}
                            title={"close menu"}
                            cssClasses={"ml-9 cursor-pointer lg:hidden"}
                            onClick={() => setIsOpen(!isOpen)}/>
                    </div>
                    <div className="my-2 bg-gray-600 h-[1px]"></div>
                </div>

                <SearchBar/>

                <Item title={"Domů"} icon={Home} link={"/"}/>
                <Item title={"O nás"} icon={People} link={"/"}/>
                <div className="my-4 bg-gray-600 h-[1px]"></div>
                <Item title={"Tvoření prezentací"} icon={Albums} link={"/"}/>
                <Item title={"Vysvětlení kódu"} icon={Code} link={"/"}/>

                <Category icon={Chatbox} title={"Chatbox"}>
                    <Item title={"Social"} icon={Chatbox} link={"/"} isCategoryItem={true}/>
                    <Item title={"Personal"} icon={Chatbox} link={"/"} isCategoryItem={true}/>
                    <Item title={"Friends"} icon={Chatbox} link={"/"} isCategoryItem={true}/>
                </Category>

                <Item title={"Odhlásit se"} link={"/"} icon={LogOut}></Item>
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
const Item = (props: {icon?: any, title: string, link: string, isCategoryItem?: boolean}) => {
    return (
        <div>
            <div
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-opacity-90 hover:bg-indigo-600 text-white"
                onClick={undefined/*() => navigate(item.link)*/}
            >
                {props.icon && <props.icon color={"#fff"}/>}
                <span className={`text-[${props.isCategoryItem ? 14 : 15}px] ml-4 text-gray-200 font-bold`}>{props.title}</span>
            </div>
        </div>
    );
}

const Category = (props: React.PropsWithChildren<{icon: any, title: string}>) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div>
            <div
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-opacity-90 hover:bg-indigo-600 text-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <props.icon color={"#fff"} />
                <div className="flex w-full items-center justify-between">
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
                    <ChevronDownOutline
                        color={"#ffffff"}
                        cssClasses={"" + (isDropdownOpen ? "rotate-180" : "")}
                    />
                </div>
            </div>
            <div
                className={"mx-auto mt-2 w-4/5 text-left text-sm font-bold text-gray-200" + (isDropdownOpen ? "" : " hidden")}
            >
                {props.children}
            </div>
        </div>
    )
}

export default Sidebar;