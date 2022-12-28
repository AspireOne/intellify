import {Component} from "react";

interface LandingPageProps {
    title: string;
    description: string;
    card1: LandingPageCard;
    card2: LandingPageCard;
    card3: LandingPageCard;
}

interface LandingPageCard {
    title: string;
    description: string;
    icon?: Component;
}

export default LandingPageProps;