import Color from "https://colorjs.io/dist/color.js";

export class Koilors {

    #color;

    get Color() {
        return this.#color;
    }

    get oklab(){
        return {
            l: this.#color.oklab.l,
            a: this.#color.oklab.a,
            b: this.#color.oklab.b
        };
    }

    set oklab(value) {
        this.#color = new Color("oklab", [value.l, value.a, value.b]);
    }

    get okhsv(){
        return {
            h: this.#color.okhsv.h,
            s: this.#color.okhsv.s,
            v: this.#color.okhsv.v
        };
    }

    set okhsv(value) {
        this.#color = new Color("okhsv", [value.h, value.s, value.v]);
    }

    get okhsl(){
        return {
            h: this.#color.okhsl.h,
            s: this.#color.okhsl.s,
            l: this.#color.okhsl.l
        };
    }

    set okhsl(value) {
        this.#color = new Color("okhsl", [value.h, value.s, value.l]);
    }

    get oklab(){
        return this.#color.oklab;
    }

    set oklab(value) {
        this.#color = new Color("oklab", [value.l, value.a, value.b]);
    }

    displayColor() {
        return this.#color.to("oklab").display();
    }

    getShade(shade) {
        let hsl = this.okhsl;
        return Koilors.fromOkhsl(hsl.h, hsl.s, shade);
    }

    static fromCSS(css) {
        let output = new Koilors();
        output.#color = new Color(css);
        return output;
    }
    
    static fromOklab(l, a, b) {
        let output = new Koilors();
        output.#color = new Color("oklab", [l, a, b]);
        return output;
    }
    
    static fromOkhsv(h, s, v) {
        let output = new Koilors();
        output.#color = new Color("okhsv", [h, s, v]);
        return output;
    }
    
    static fromOkhsl(h, s, l) {
        let output = new Koilors();
        output.#color = new Color("okhsl", [h, s, l]);
        return output;
    }
    
    static fromOklab(l, a, b) {
        let output = new Koilors();
        output.#color = new Color("oklab", [l, a, b]);
        return output;
    }
    
    static setLocalColor(target, name, color) {
        target.style.setProperty(name, color.displayColor());
    }
    
    static setColor(name, color) {
        document.documentElement.style.setProperty(name, color.displayColor());
    }

    // a * (1 - t) + b * t
    static lerp(a, b, t) {
        let oneMinusT = 1.0 - t;
        let oklabA = a.oklab;
        let oklabB = b.oklab;
        let okhslA = a.okhsl;
        let okhslB = b.okhsl;
        let l = oklabA.l * oneMinusT + oklabB.l * t;
        let aa = oklabA.a * oneMinusT + oklabB.a * t;
        let bb = oklabA.b * oneMinusT + oklabB.b * t;

        let tempColor = Koilors.fromOklab(l, aa, bb);

        let h = tempColor.okhsl.h;
        let s = okhslA.s * oneMinusT + okhslB.s * t;
        l = tempColor.okhsl.l;
        l = okhslA.l * oneMinusT + oklabB.l * t;

        let tempColorB = Koilors.fromOkhsl(h, s, l);

        oklabA = tempColor.oklab;
        oklabB = tempColorB.oklab;
        
        l = (oklabA.l + oklabB.l) / 2.0;
        aa = (oklabA.a + oklabB.a) / 2.0;
        bb = (oklabA.b + oklabB.b) / 2.0;

        return Koilors.fromOklab(l, aa, bb);
    }
}