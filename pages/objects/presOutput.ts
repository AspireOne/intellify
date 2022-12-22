import pptxgen from "pptxgenjs";
import {PresParams} from "../api/presentation";
import presOutput from "./presOutput";

class PresOutput {
    public output: string;
    public params: PresParams;

    constructor(output: string, params: PresParams) {
        this.output = output;
        this.params = params;
    }

    private decomposePres(pres: String, includeInfo: boolean) {
        /*
        *
        *
        * */

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

        let presDecomposed = {};
        let currSlide: string = "";

        // Trim newlines.
        pres = pres.trim();

        pres.split("\n").forEach((line, i) => {
            // If the line is blank.
            if (line.length <= 1) return;

            // If new slide, add slide.
            if (line.startsWith("Slide")) {
                currSlide = line.length > 9 ? line.substring(9) : line;
                // @ts-ignore
                presDecomposed[currSlide] = [];
                return;
            }

            // If a bullet point, add it to the current slide.
            if (line.match(/^\d/) || line.startsWith("-")) {
                // @ts-ignore
                presDecomposed[currSlide].push(line);
                return;
            }

            // Else it is an introduction or a conclusion. Add it to the object separately.
            if (!includeInfo) return;
            // @ts-ignore
            if (i <= 4) presDecomposed["Představení"] = line;
            // @ts-ignore
            else (presDecomposed["Závěr"] = line);
        });
        return presDecomposed;
    }

    public downloadPres(pres: pptxgen, name?: string) {
        pres.writeFile({fileName: (name || this.params.topic as string) + ".pptx"});
    }

    public genPres(author?: string, images: boolean = false, includeInfo: boolean = false): pptxgen {
        const decomposedPres = this.decomposePres(this.output, includeInfo);
        const gen = new pptxgen();
        this.addOutlineSlide(gen, decomposedPres);
        this.addSlidesFromPres({
            gen,
            decomposedPres,
            author,
            images
        });
        this.addThanksSlide(gen, author);
        return gen;
    }

    private addThanksSlide(gen: pptxgen, author?: string): void {
        const slide = gen.addSlide();
        // Create a slide with thanks in the center.
        slide.addText("Děkuji za pozornost!", {x: 0.5, y: "30%", w: 9, h: 1, align: "center", fontSize: 48, color: "3399ff"});
        if (author) {
            // Add author to the bottom right corner.
            slide.addText("Vytvořil: " + author, {x: 0.5, y: "50%", w: 9, h: 1, align: "center", fontSize: 20, color: "ff9999"});
        }
    }

    private addOutlineSlide(gen: pptxgen, decomposedPres: any): void {
        const slide = gen.addSlide();
        slide.addText("Obsah", {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "363636"});
        let pointsStr: string = "";
        for (const [key, value] of Object.entries(decomposedPres)) {
            if (key == "Představení" || key == "Závěr") continue;
            pointsStr += "• " + key + "\n\n";
        }

        const sizes = PresOutput.calculateSizes(pointsStr.split("\n").length);
        slide.addText(pointsStr, {x: 0.5, y: sizes.y, w: 9, align: "left", fontSize: sizes.fontSize, color: "363636"});
    }

    private addSlidesFromPres(props: {gen: pptxgen, decomposedPres: any, author?: string, images?: boolean}) {
        for (const [key, value] of Object.entries(props.decomposedPres)) {
            const slide = props.gen.addSlide();

            if (key == "Představení" || key == "Závěr") {
                slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "363636"});
                slide.addText(value as string, {x: 0.5, y: 2.5, w: "100%", align: "left", fontSize: 15, color: "363636"});
                continue;
            }
            slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "3399ff"});

            // Concatenate bullet points to string.
            const pointsStr = presOutput.getPointsAsString(value as string[]);
            const lines = pointsStr.split("\n").length;
            const sizes = presOutput.calculateSizes(lines);

            // Add bullet points.
            slide.addText(pointsStr, {x: 0.5, y: sizes.y, w: 9, align: "left", fontSize: sizes.fontSize, color: "363636"});

            if (props.author) {
                slide.addText("Vytvořil: " + props.author, {x: 7.6, y: "90%", w: 2, h: 0.5, align: "right", fontSize: 13, color: "604020"});
            }

            if (props.images && !key.includes("Slide")) {
                const linkSlide = props.gen.addSlide();
                // String template.
                const link = `https://www.google.com/search?q=${key}&tbm=isch`;
                // Add a link to the slide.
                linkSlide.addText(link, {x: 0.5, hyperlink: {url: link, tooltip: "Ilustrační obrázek"}, y: "40%", w: 9, align: "center", fontSize: 15, color: "363636"});
            }
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

    private static getPointsAsString(points: string[]) {
        let pointsStr: string = "";
        for (let i = 0; i < points.length; i++) pointsStr += points[i] + "\n\n";
        return pointsStr;
    }
}

export default PresOutput;