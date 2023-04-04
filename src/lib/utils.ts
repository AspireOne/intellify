export default class Utils {
    public static tokensToWords(tokens: number | null | undefined, round?: boolean) {
        if (!tokens) return tokens;

        let words = Math.round(tokens * 0.75);
        if (round) words = Math.round(words / 1000) * 1000;
        // Formatted so that 50000 = 50 000.
        return words.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }

    public static tokensToPages(tokens: number | null | undefined) {
        if (!tokens) return tokens;
        const pages = (tokens * 0.75) / 225;
        return Math.round(pages);
    }
}