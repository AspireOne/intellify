import {Component} from "react";

interface LandingPageParams {
    title: string|Element;
    description: string|Element;
    card1: LandingPageCard;
    card2: LandingPageCard;
    card3: LandingPageCard;
}

interface LandingPageCard {
    title: string;
    description: string;
    icon?: Component;
}

export default LandingPageParams;