import pptxgen from "pptxgenjs";
import {z} from "zod";
import {createPresentationInput} from "../server/schemas/presentation";

interface parsedContent {[key: string | "null"]: string[]}
class Presentation {
    public params: z.infer<typeof createPresentationInput>;
    private contentParsed: parsedContent;
    private _content: string;
    public get content(): string { return this._content; }
    public set content(value: string) {
        this._content = value;
        this.contentParsed = this.parse(value);
    }

    public constructor(content: string, params: z.input<typeof createPresentationInput>) {
        this.params = params;
        this._content = content;
        this.contentParsed = this.parse(content);
    }

    private parse(content: string): parsedContent {
        // v1:
        // Slide 1.
        // 1. co je to poník?
        // ...

        // v2:
        // Slide 1. O ponících
        // 1. Co je to poník?
        // ...

        // v3:
        // Slide 1: O ponících
        // 1. Co je to poník?
        // ...

        const parsed: {[key: string | "null"]: string[]} = {};
        let currSlide: string = "";

        content = content.trim();
        content.split("\n").forEach((line, i) => {
            // If the line is blank, skip it.
            if (line.length <= 1) return;

            // If new slide, add slide.
            if (line.toLowerCase().startsWith("slide")) {
                // The line will start with "slide", "slide 1.", or "slide 1". Remove that part.
                currSlide = line.replace(new RegExp(/^slide \d(\.|:)? /i), "");
                parsed[currSlide] = [];
                return;
            }

            // If a bullet point, add it to the current slide.
            if (line.match(/^\d\./) || line.startsWith("- ")) {
                // @ts-ignore
                parsed[currSlide].push(line);
                return;
            }

            // Else it is something else (introduction, conclusion, explanation).
            // Add it to the object with no key.
            /*if (!includeInfo) return;
            // @ts-ignore
            if (i <= 4) objectified["null"] = line;
            // @ts-ignore
            else (objectified["null"] = line);*/
        });
        return parsed;
    }

    private createPptx(author?: string): pptxgen {
        const gen = new pptxgen();
        this.addMainSlide(gen);
        this.addOutlineSlide(gen);
        this.addSlides({gen, author});
        this.addThanksSlide(gen, author);
        return gen;
    }

    public download(name?: string, author?: string): void {
        this.createPptx(author).writeFile({fileName: (name || "prezentace open-tools") + ".pptx"});
    }

    private addMainSlide(gen: pptxgen): void {
        const slide = gen.addSlide();
        slide.addText(this.params.topic, {x: 0.5, y: 1.3, w: 9, h: 1, align: "center", fontSize: 48, bold: true, color: "ffffff"});
        slide.addText("Vítejte u prezentace", {x: 0.5, y: 2, w: 9, h: 1, align: "center", fontSize: 18, color: "d9d9d9"});
        slide.background = {path: "/assets/bkg.png"};
    }

    private addOutlineSlide(gen: pptxgen): void {
        const slide = gen.addSlide();
        slide.addText("Obsah", {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "363636"});
        let pointsStr: string = "";
        for (const [key, value] of Object.entries(this.contentParsed)) {
            if (key === null || key === "null") continue;
            pointsStr += "• " + key + "\n\n";
        }

        const sizes = Presentation.calculateSizes(pointsStr.split("\n").length);
        slide.addText(pointsStr, {x: 0.5, y: sizes.y, w: 9, align: "left", fontSize: sizes.fontSize, color: "363636"});
    }

    private addSlides(params: {gen: pptxgen, author?: string}): void {
        for (const [key, value] of Object.entries(this.contentParsed)) {
            const slide = params.gen.addSlide();

            /*if (key == "Představení" || key == "Závěr") {
                slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "363636"});
                slide.addText(value as string, {x: 0.5, y: 2.5, w: "100%", align: "left", fontSize: 15, color: "363636"});
                continue;
            }*/
            slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "3399ff"});

            // Concatenate bullet points to string.
            const pointsStr = Presentation.formatPoints(value as string[]);
            const lines = pointsStr.split("\n").length;
            const sizes = Presentation.calculateSizes(lines);

            // Add bullet points.
            slide.addText(pointsStr, {x: 0.5, y: sizes.y, w: 9, align: "left", fontSize: sizes.fontSize, color: "363636"});

            if (params.author) {
                slide.addText("Vytvořil: " + params.author, {x: 7.6, y: "90%", w: 2, h: 0.5, align: "right", fontSize: 13, color: "604020"});
            }

            if (this.params.includeImages && !key.includes("Slide")) {
                const linkSlide = params.gen.addSlide();
                // String template.
                const link = `https://www.google.com/search?q=${key}&tbm=isch`;
                // Add a link to the slide.
                linkSlide.addText(link, {x: 0.5, hyperlink: {url: link, tooltip: "Ilustrační obrázek"}, y: "40%", w: 9, align: "center", fontSize: 15, color: "363636"});
            }
        }
    }

    private addThanksSlide(gen: pptxgen, author?: string): void {
        const slide = gen.addSlide();
        // Create a slide with thanks in the center.
        slide.addText("Děkuji za pozornost!", {x: 0.5, y: "30%", w: 9, h: 1, align: "center", fontSize: 48, color: "3399ff"});
        slide.background = {path: "/assets/bkg.png"};
        if (author) {
            // Add author to the bottom right corner.
            slide.addText("Vytvořil: " + author, {x: 0.5, y: "50%", w: 9, h: 1, align: "center", fontSize: 20, color: "ff9999"});
        }
    }

    private static calculateSizes(lines: number): {y: number, fontSize: number} {
        let fontSize = 16;
        // Hardcode this shit.
        if (lines > 8) fontSize = 14;
        else if (lines > 10) fontSize = 11;

        let yFactor = 0.2;
        let y = 1 + ((fontSize - 15) * 0.2);
        // This is to compensate for the text shift on different sizes.
        y += (lines * yFactor);

        return {y, fontSize};
    }

    private static formatPoints(points: string[]): string {
        let pointsStr: string = "";
        for (let i = 0; i < points.length; i++) {
            // If point starts with a number (x. ), replace it with "-".
            if (points[i].match(/^\d\./)) points[i] = points[i].replace(/^\d\./, "•");
            else if (points[i].startsWith("-")) points[i] = points[i].replace("-", "•");
            pointsStr += points[i] + "\n\n";
        }
        return pointsStr;
    }
}

export default Presentation;