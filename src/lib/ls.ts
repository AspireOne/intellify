/**
 * Local storage wrapper.
 * */
export default class Ls {
    private static readonly prefix = "opentools.";
    private static readonly hasEverBeenSignedInKey = this.prefix + "has_been_signed";
    private static readonly isSignedInKey = this.prefix + "is_signed_in";

    private static set hasEverBeenSignedIn(value: boolean) {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(Ls.hasEverBeenSignedInKey, value.toString());
    }

    static get hasEverBeenSignedIn(): boolean {
        if (typeof localStorage === "undefined") return false;
        return localStorage.getItem(Ls.hasEverBeenSignedInKey) === "true";
    }

    static set isSignedIn(value: boolean) {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(Ls.isSignedInKey, value.toString());
        if (value) Ls.hasEverBeenSignedIn = true;
    }

    static get isSignedIn(): boolean {
        if (typeof localStorage === "undefined") return false;
        return localStorage.getItem(Ls.isSignedInKey) === "true";
    }
}

// TODO: Implement useLs.
/*
function useLs() {
    const hasEverBeenSignedIn = Ls.hasEverBeenSignedIn;
    const isSignedIn = Ls.isSignedIn;

    const setIsSignedIn = (value: boolean) => {
        Ls.isSignedIn = value;
    };

    return {hasEverBeenSignedIn, isSignedIn, setIsSignedIn};
}

export {useLs};*/
