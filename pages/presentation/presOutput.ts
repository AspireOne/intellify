import pptxgen from "pptxgenjs";
import {PresParams} from "../api/presentation";

class PresOutput {
    public output: string;
    public params: PresParams;

    constructor(output: string, params: PresParams) {
        this.output = output;
        this.params = params;
    }

    private decomposePres(pres: String) {
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

        pres.split("\n").forEach((line, i) => {
            // If the line is blank.
            if (line.length < 2) return;

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
            // @ts-ignore
            if (i == 0) presDecomposed["introduction"] = line;
            // @ts-ignore
            else (presDecomposed["conclusion"] = line);
        });
        return presDecomposed;
    }

    public downloadPres(pres: pptxgen, name?: string) {
        pres.writeFile({fileName: (name || this.params.topic as string) + ".pptx"});
    }

    public genPres(author?: string): pptxgen {
        const decomposedPres = this.decomposePres(this.output);
        const gen = new pptxgen();

        for (const [key, value] of Object.entries(decomposedPres)) {
            const slide = gen.addSlide();

            if (key == "introduction" || key == "conclusion") {
                // Add title.
                slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "363636"});
                // Add the introduction.
                slide.addText(value as string, {x: 0.5, y: 2.5, w: "100%", /*h: 0.5, */align: "left", fontSize: 15, color: "363636"});
                continue;
            }

            // Add title to slide.
            slide.addText(key, {x: 0.5, y: 0.1, w: 9, h: 1, align: "left", fontSize: 48, color: "3399ff"});

            // Concatenate bullet points to string.
            let points: string[] = value as string[];
            let pointsStr: string = "";
            for (let i = 0; i < points.length; i++) {
                pointsStr += points[i] + "\n\n";
            }

            // Add bullet points.
            slide.addText(pointsStr, {x: 0.5, y: 3, w: 9, /*h: 0.5, */align: "left", fontSize: 18, color: "363636"});

            if (author) {
                slide.addText("Vytvořil: " + author, {x: 7.6, y: "90%", w: 2, h: 0.5, align: "right", fontSize: 14, color: "604020"});
            }
        }

        // Add thanks.
        const slide = gen.addSlide();
        // Create a slide with thanks in the center.
        slide.addText("Děkuji za pozornost!", {x: 0.5, y: "30%", w: 9, h: 1, align: "center", fontSize: 48, color: "3399ff"});
        if (author) {
            // Add author to the bottom right corner.
            slide.addText("Vytvořil: " + author, {x: 0.5, y: "50%", w: 9, h: 1, align: "center", fontSize: 20, color: "ff9999"});
        }

        return gen;
    }
}

export default PresOutput;