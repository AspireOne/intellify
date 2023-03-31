import {twMerge} from "tailwind-merge";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Close} from "react-ionicons";

export function AutoPopup(props: React.PropsWithChildren<{className?: string, trigger?: React.ReactElement, title: string}>) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popup className={props.className} trigger={props.trigger} title={props.title} open={open} setOpen={setOpen}>
            {props.children}
        </Popup>);
}
export default function Popup(props: React.PropsWithChildren<{className?: string, trigger?: React.ReactElement, open: boolean, setOpen: (open: boolean) => void, unclosable?: boolean, title: string}>) {
    // TODO: This is not working properly. It's not closing when clicking outside of the popup.
    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                if (props.open && !props.unclosable) props.setOpen(false)
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            {
                props.trigger &&
                <div onClick={() => {
                    if (props.open && !props.unclosable) props.setOpen(false)
                    if (!props.open) props.setOpen(true)
                }}
                     className={"inline hover:cursor-pointer"}>
                    {props.trigger}
                </div>
            }
            <AnimatePresence>
                {
                    props.open &&
                    <div className={"z-[100]"} // Otherwise elements that have higher z-index will be rendered above the popup.
                        key="modal"
                    >
                        <motion.div
                            transition={{duration: 0.2}}
                            initial={{ opacity: 0, backdropFilter: "blur(0px)"}}
                            animate={{ opacity: 1, backdropFilter: "blur(2px)"}}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)"}}

                            onClick={(e) => {
                                if (props.open && !props.unclosable) props.setOpen(false)
                                if (!props.open) props.setOpen(true)
                            }}
                            className={twMerge("fixed top-0 left-0 w-full h-full " +
                                "bg-black bg-opacity-40 flex justify-center items-center " + (props.className ?? ""))}>
                            <div onClick={(e) => e.stopPropagation()} className="relative mx-auto min-w-[300px] break-word max-w-[600px] bg-t-alternative-700 rounded-lg p-6 pb-8">
                                <Close color={"#b2b2b2"} width={"30px"} height={"auto"} cssClasses={"cursor-pointer absolute right-3 top-3"}
                                       onClick={() => !props.unclosable && props.setOpen(false)}/>
                                <h2 className={"font-bold text-2xl text-center mb-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text"}>{props.title}</h2>
                                {props.children}
                            </div>
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
        </>
    );
}