export default class Utils {
    public static tokensToWords(tokens: number | null | undefined) {
        if (!tokens) return tokens;

        const words = Math.round(tokens * 0.75);
        const wordsRounded = Math.round(words / 1000) * 1000;
        // Formatted so that 50000 = 50 000.
        return wordsRounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }
}