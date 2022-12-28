import {NextPage} from "next";
import {Apps, ChevronDownOutline, Close, Home, Menu, Search} from "react-ionicons";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom"

// TODO: pass in the websites + the active one?
const Sidebar: NextPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setIsOpen(window.innerWidth > 768);
    }, []);

    return (
        <aside>
            <Menu color={"#fff"} height={"50px"} width={"50px"}
                  onClick={() => setIsOpen(!isOpen)}
                  cssClasses={"absolute top-5 left-4 cursor-pointer bg-t-blue-500 rounded-md p-2.5"}/>

            <div className={"h-screen sticky top-0 bottom-0 lg:left-0 p-2 w-[250px] overflow-y-auto text-center bg-t-blue-700 rounded-md"
                + (isOpen ? "": " hidden")}>
                <div className="text-xl text-gray-100">
                    <div className="p-2.5 mt-1 flex items-center">
                        <Apps width={"35px"} height={"35px"} color={"white"} cssClasses={"rounded-md bg-blue-600 p-1.5"} />
                        <h3 className="text-gray-200 text-md ml-3">Open Tools</h3>
                        <Close
                            color={"#fff"}
                            cssClasses={"ml-9 cursor-pointer lg:hidden"}
                            onClick={() => setIsOpen(!isOpen)}/>
                    </div>
                    <div className="my-2 bg-gray-600 h-[1px]"></div>
                </div>
                <div
                    className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
                >
                    <Search cssClasses="text-sm" color={"#e7e7e7"}/>
                    <input
                        type="text"
                        placeholder="Search"
                        className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                    />
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <Home cssClasses="" color={"#fff"}/>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <i className="bi bi-bookmark-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Bookmark</span>
                </div>
                <div className="my-4 bg-gray-600 h-[1px]"></div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <i className="bi bi-chat-left-text-fill"></i>
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
                    id="submenu"
                >
                    <h1 className="mt-1 cursor-pointer rounded-md p-2 hover:bg-blue-600">
                        Social
                    </h1>
                    <h1 className="mt-1 cursor-pointer rounded-md p-2 hover:bg-blue-600">
                        Personal
                    </h1>
                    <h1 className="mt-1 cursor-pointer rounded-md p-2 hover:bg-blue-600">
                        Friends
                    </h1>
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;