import {twMerge} from "tailwind-merge";
import React, {useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";

export function AutoPopup(props: React.PropsWithChildren<{className?: string, trigger?: React.ReactElement, title: string}>) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popup className={props.className} trigger={props.trigger} title={props.title} open={open} setOpen={setOpen}>
            {props.children}
        </Popup>);
}
export default function Popup(props: React.PropsWithChildren<{className?: string, trigger?: React.ReactElement, open: boolean, setOpen: (open: boolean) => void, title: string}>) {
    return (
        <>
            {
                props.trigger &&
                <div onClick={() => props.setOpen(!props.open)} className={"inline hover:cursor-pointer"}>
                    {props.trigger}
                </div>
            }
            <AnimatePresence>
                {
                    props.open &&
                    <motion.div
                        className={"z-[10]"} // Otherwise elements that have higher z-index will be rendered above the popup.
                        key="modal"
                        transition={{duration: 0.2}}
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0}}
                    >
                        <div onClick={() => props.setOpen(false)} className={twMerge("fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center " + (props.className ?? ""))}>
                            <div className="mx-auto min-w-[300px] break-all max-w-[600px] bg-t-alternative-700 rounded-lg p-6 pb-8">
                                <h2 className={"font-bold text-2xl text-center mb-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text"}>{props.title}</h2>
                                {props.children}
                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    );
}