import {NextPage} from "next";
import React, {PropsWithChildren} from "react";

import {IconType} from "react-icons";
import Link from "next/link";
import {paths} from "../lib/constants";
import {
    HiOutlineAnnotation,
    HiOutlineCode,
    HiOutlineInformationCircle,
    HiOutlineDocument,
    HiOutlineMail,
    HiOutlinePencil,
    HiOutlinePencilAlt, HiOutlinePresentationChartBar, HiOutlineSparkles
} from "react-icons/hi";
import PageTitle from "../components/PageTitle";
import PageHeaderDiv from "../components/PageHeaderDiv";
import Subtitle from "../components/Subtitle";
import Title from "../components/Title";
// import ai lock icons.
import {AiOutlineLock, AiOutlineUnlock, AiOutlineInfoCircle, AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {trpc} from "../lib/trpc";
import {OfferId} from "../server/schemas/offers";
import PageHead from "../components/PageHead";
import {InformationCircleOutline} from "react-ionicons";
import {AutoPopup} from "../components/Popup";

const Tools: NextPage = () => {
    const {data} = trpc.user.getUser.useQuery();
    const subscriptionId = data?.subscription?.data?.id;

    const basicLocked = subscriptionId !== OfferId.PLAN_BASIC;
    const studentLocked = subscriptionId !== OfferId.PLAN_STUDENT;
    const companyLocked = subscriptionId !== OfferId.PLAN_COMPANY;

    return (
        <>
            <PageHead title={"Nástroje"} description="Na tomto místě najdete všechny vaše A.I. nástroje. Ať už
            upravujete text, vytváříte prezentace, nebo si necháváte poradit s programováním, zde najdete všechny nástroje."/>
            <PageHeaderDiv>
                <PageTitle>Nástroje</PageTitle>
                <Subtitle>Na tomto místě najdete všechny vaše A.I. nástroje.</Subtitle>
            </PageHeaderDiv>

            <ToolSection locked={basicLocked} title={"Základní předplatné"}>
                <BasicPlanTools locked={basicLocked}/>
            </ToolSection>

            <ToolSection locked={studentLocked} title={"Studentské předplatné"}>
                <StudentPlanTools locked={studentLocked}/>
            </ToolSection>

            <ToolSection locked={companyLocked} title={"Firemní předplatné"}>
                <CompanyPlanTools locked={companyLocked}/>
            </ToolSection>
        </>
    );
}

function BasicPlanTools(props: {locked: boolean}) {
    return (
        <>
            <ToolCard comingSoon={true} href={paths.index} icon={HiOutlinePencilAlt} description={"Editor textů"} index={0}/>
            <ToolCard comingSoon={true} href={paths.codeAssistant} icon={HiOutlineCode} description={"Asistent k programování"} index={1}/>
            <ToolCard comingSoon={false} href={paths.email} icon={HiOutlineMail} description={"Psaní e-mailů"} index={2}/>
            <ToolCard comingSoon={false} href={paths.generalAi} icon={HiOutlineSparkles} description={"Obecné A.I."} index={5}/>
        </>
    )
}

function StudentPlanTools(props: {locked: boolean}) {
    return (
        <>
            <BasicPlanTools locked={props.locked}/>
            <ToolCard comingSoon={true} href={paths.presentation} icon={HiOutlinePresentationChartBar} description={"Tvorba prezentací"} index={3}/>
            <ToolCard comingSoon={true} href={paths.index} icon={HiOutlinePencil} description={"Psaní eseje"} index={4}/>
        </>
    )
}

function CompanyPlanTools(props: {locked: boolean}) {
    return (
        <>
            <StudentPlanTools locked={props.locked}/>
            <ToolCard comingSoon={true} href={paths.index} icon={HiOutlineAnnotation} description={"Generování příspěvků"} index={6}/>
        </>
    )
}


function ToolSection(props: PropsWithChildren<{title: string, locked: boolean}>) {
    return (
        <div className={"mb-8"}>
            <div className={"flex flex-row flex-wrap items-center gap-3 mb-2"}>
                <Title size={2}>
                    {props.title}
                </Title>
                <LockMarker locked={props.locked}/>
                {props.locked && <AvailableWithTokens/>}
            </div>
            <div className="flex flex-row flex-wrap gap-8 sm:gap-4 bg-gray-800/20 justify-start rounded-lg p-4">
                {props.children}
            </div>
        </div>
    )
}

function LockMarker(props: {locked: boolean}) {
    return (
        <div>
            <Link href={paths.pricing} className={`py-1 px-3 flex flex-row justify-center items-center gap-1 rounded-full ${props.locked ? "bg-red-500/50" : "bg-green-500/50"}`}>
                {props.locked ? <AiOutlineLock/> : <AiOutlineUnlock/>}
            </Link>
        </div>
    )
}

function AvailableWithTokens() {
    return (
        <span className={"py-1 text-sm px-3 bg-white/10 rounded-full flex flex-row items-center justify-center gap-2"}>
            <AiOutlineInfoCircle/>
            Dostupné s koupenými slovy
        </span>
    )
}
function ToolCard(props: {icon: IconType, color?: string, href: string, description: string, index: number, comingSoon: boolean}) {
    // Define an array of background colors to create a gradient effect
    const colors = ['#FCA5A5', '#eee47c', '#A7F3D0', '#6EE7B7', '#6EE7E7', '#C3A5F8', '#F5A5F7']
        .map((color) => color + (props.comingSoon ? "50" : "90"));
    const color = colors[props.index % colors.length];

    {/*TODO: Add border/inner shadow?*/}
    const card = (
        <div className={`relative rounded-md flex flex-col ${props.comingSoon ? "gap-0" : "gap-2"}`}>
            {/*<InformationCircleOutline cssClasses={"-mb-2 transition duration-100 absolute top-1 right-1 hover:w-[25px]"}
                                      width={"23px"}
                                      height={"auto"}
                                      color={"rgba(134,134,134,0.8)"}/>*/}

            <div className={`${props.comingSoon ? "cursor-default rounded-t-md" : "hover:bg-gray-700 rounded-md"} 
            transition duration-100 bg-t-alternative-700 flex flex-col gap-2 items-center w-32 h-28 p-4 relative`}>
                {/*<div className={"absolute top-1 right-1"} onClick={(e) => {
                    e.stopPropagation();
                    return false;
                }}>
                    <AutoPopup title={"Informace"} trigger={<HiOutlineInformationCircle onClick={(e) => {
                        e.stopPropagation();
                    }} className={
                        "w-[23px] h-auto text-gray-500 hover:text-gray-200 cursor-default"}/>}>
                    </AutoPopup>
                </div>*/}
                {<props.icon color={color} size={"35px"}/>}
                <p className={`text-sm text-center ${props.comingSoon ? "text-gray-400" : "text-gray-200"}`}>
                    {props.description}
                </p>
            </div>
            {
                props.comingSoon &&
                <div className={"text-gray-400 cursor-default py-0 px-3 flex flex-row text-sm gap-2 items-center justify-center rounded-b-md bg-white/20"}>
                    Již brzy...
                </div>
            }
        </div>
    );

    if (props.comingSoon) return card;
    else return <Link className={""} href={props.href}>{card}</Link>;
}

export default Tools;