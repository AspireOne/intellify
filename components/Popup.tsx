import {twMerge} from "tailwind-merge";
import React, {useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function Popup(props: React.PropsWithChildren<{className?: string, trigger?: React.ReactElement, onClose?: () => void, open?: boolean, title: string}>) {
    const [isOpen, setIsOpen] = React.useState(props.open ?? false);

    useEffect(() => {
        if (!isOpen && props.onClose) props.onClose();
    }, [isOpen])

    return (
        <>
            {
                props.trigger &&
                <div onClick={() => setIsOpen(!isOpen)} className={"inline hover:cursor-pointer"}>
                    {props.trigger}
                </div>
            }
            <AnimatePresence>
                {
                    isOpen &&
                    <motion.div
                        className={"z-[10]"} // Otherwise elements that have higher z-index will be rendered above the popup.
                        key="modal"
                        transition={{duration: 0.2}}
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0}}
                    >
                        <div onClick={() => setIsOpen(false)} className={twMerge("fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center " + (props.className ?? ""))}>
                            <div className="min-w-[300px] max-w-[600px] bg-t-alternative-700 rounded-lg p-6 pb-8">
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