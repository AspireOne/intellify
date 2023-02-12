import {lsKeys} from "./constants";

/**
 * Local storage wrapper.
 * */
export default class Ls {
    static set hasBeenSigned(value: boolean) {
        localStorage.setItem(lsKeys.hasBeenSigned, value.toString());
    }

    static get hasBeenSigned(): boolean {
        if (typeof localStorage === "undefined") return false;
        return localStorage.getItem(lsKeys.hasBeenSigned) === "true";
    }
}