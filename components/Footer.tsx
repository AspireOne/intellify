import {NextPage} from "next";
import React from "react";
import Link from "next/link";

const Footer: NextPage = () => {
    return (
        <footer
            className="p-4 m-3 rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 bg-t-blue-500">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © 2023 <a href="https://flowbite.com/" className="hover:underline">Matěj Pešl</a>. All Rights Reserved.
    </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                {/*<li>
                    <Link href="/o-nas" className="mr-4 hover:underline md:mr-6 ">O nás</Link>
                </li>*/}
                <li>
                    <a href="/ochrana-soukromi" className="mr-4 hover:underline md:mr-6">Zásady ochrany soukromí</a>
                </li>
                <li>
                    <a href="/licencovani" className="mr-4 hover:underline md:mr-6">Licence a autorská práva</a>
                </li>
                <li>
                    <a href="/kontakt" className="hover:underline">Kontakt</a>
                </li>
            </ul>
        </footer>
    );
}
export default Footer;