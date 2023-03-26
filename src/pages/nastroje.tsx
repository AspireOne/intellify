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
import PageHeaderDiv from "../components/PageHeaderDiv";
import Subtitle from "../components/Subtitle";
import Title from "../components/Title";

const Tools: NextPage = () => {
    return (
        <>
            <PageHeaderDiv>
                <PageTitle>Nástroje</PageTitle>
                <Subtitle>Na tomto místě najdete všechny vaše A.I. nástroje.</Subtitle>
            </PageHeaderDiv>

            <ToolSection title={"Základní předplatné"}>
                <BasicPlanTools/>
            </ToolSection>

            <ToolSection title={"Studentské předplatné"}>
                <StudentPlanTools/>
            </ToolSection>

            <ToolSection title={"Firemní předplatné"}>
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
            <Title size={2} className={"mb-2"}>
                {props.title}
            </Title>
            <div className="flex flex-row flex-wrap gap-8 sm:gap-4 bg-gray-800/20 justify-start rounded-lg p-4">
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