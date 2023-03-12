import {NextPage} from "next";
import React from "react";
import Link from "next/link";
import {paths} from "../lib/constants";

const Footer: NextPage = () => {
    return (
        <footer
            className="p-4 m-3 rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 bg-t-blue-500">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © 2023 <a href="https://www.linkedin.com/in/matej-pesl/" className="hover:underline">Matěj Pešl</a>. All Rights Reserved.
    </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                {/*<li>
                    <Link href="/o-nas" className="mr-4 hover:underline md:mr-6 ">O nás</Link>
                </li>*/}
                <li>
                    <Link href={paths.privacyPolicy} className="mr-4 hover:underline md:mr-6">Zásady ochrany soukromí</Link>
                </li>
                <li>
                    {/*TODO*/}
                    <Link href={paths.licensing} className="mr-4 hover:underline md:mr-6">Licence a autorská práva</Link>
                </li>
                <li>
                    {/*TODO*/}
                    <Link href={paths.contact} className="hover:underline">Kontakt</Link>
                </li>
            </ul>
        </footer>
    );
}
export default Footer;