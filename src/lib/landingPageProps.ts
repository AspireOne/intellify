import {Component} from "react";

interface LandingPageProps {
    title: string;
    description: string;
    callToActionButtonSigned: CallToActionButton;
    card1: LandingPageCard;
    card2: LandingPageCard;
    card3: LandingPageCard;
    callToActionTextUnsigned: string;
}

interface CallToActionButton {
    title: string;
    targetElementId: string;
}

interface LandingPageCard {
    title: string;
    description: string;
    icon?: Component;
}

export default LandingPageProps;