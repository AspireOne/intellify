import {NextPage} from "next";
import React, {PropsWithChildren} from "react";

import {IconType} from "react-icons";
import Link from "next/link";
import {paths} from "../lib/constants";
import {
    HiOutlineAnnotation,
    HiOutlineCode,
    HiOutlineDocument,
    HiOutlinePencil,
    HiOutlinePencilAlt, HiOutlinePresentationChartBar, HiOutlineSparkles
} from "react-icons/hi";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";

const Tools: NextPage = () => {
    return (
        <>
            <PageTitle>Nástroje</PageTitle>

            <ToolSection title={"Základní plán"}>
                <BasicPlanTools/>
            </ToolSection>

            <ToolSection title={"Studentský plán"}>
                <StudentPlanTools/>
            </ToolSection>

            <ToolSection title={"Firemní plán"}>
                <CompanyPlanTools/>
            </ToolSection>
        </>
    );
}

function BasicPlanTools() {
    return (
        <>
            <ToolCard href={paths.index} icon={HiOutlinePencilAlt} description={"Editor textů"} index={0}/>
            <ToolCard href={paths.codeAssistant} icon={HiOutlineCode} description={"Asistent k programování"} index={1}/>
            <ToolCard href={paths.index} icon={HiOutlineDocument} description={"Tvorba životopisu"} index={2}/>
        </>
    )
}

function StudentPlanTools() {
    return (
        <>
            <BasicPlanTools/>
            <ToolCard href={paths.presentation} icon={HiOutlinePresentationChartBar} description={"Tvorba prezentací"} index={3}/>
            <ToolCard href={paths.index} icon={HiOutlinePencil} description={"Psaní eseje"} index={4}/>
            <ToolCard href={paths.generalAi} icon={HiOutlineSparkles} description={"Obecné A.I."} index={5}/>
        </>
    )
}

function CompanyPlanTools() {
    return (
        <>
            <StudentPlanTools/>
            <ToolCard href={paths.index} icon={HiOutlineAnnotation} description={"Generování příspěvků"} index={6}/>
        </>
    )
}


function ToolSection(props: PropsWithChildren<{title: string}>) {
    return (
        <div className={"mb-8"}>
                <h3 className="mt-4 mb-2 text-2xl tracking-tight font-semibold text-gray-900 dark:text-white">
                {props.title}
            </h3>
            <div className="flex flex-row flex-wrap gap-4 bg-gray-800/20 inline-flex justify-center sm:justify-start rounded-lg p-4">
                {props.children}
            </div>
        </div>
    )
}

function ToolCard(props: {icon: IconType, color?: string, href: string, description: string, index: number}) {
    // Define an array of background colors to create a gradient effect
    const colors = ['#FCA5A5', '#eee47c', '#A7F3D0', '#6EE7B7', '#6EE7E7', '#C3A5F8', '#F5A5F7'].map((color) => color + "90");
    const color = colors[props.index % colors.length];

    return (
        <Link
            href={props.href} className={`hover:bg-gray-700 transition duration-100 rounded-md bg-t-alternative-700 flex flex-col gap-2 items-center w-32 min-w-32 p-4`}
        >
            {<props.icon color={color} size={"35px"}/>}
            <p className={"text-sm text-center text-gray-200"}>{props.description}</p>
        </Link>
    )
}

export default Tools;