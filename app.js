import { Koilors } from "./koilors.js";
import { LiveData } from "./core/livedata.js";
import { Slider } from "./core/slider.js";

function loopDegrees(x) {
    if (x < 0.0) {
        return loopDegrees(x + 360.0);
    }
    return x % 360.0;
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

const baseColor = new LiveData(Koilors.fromCSS("#0046ff"));
const hueMode = new LiveData("hsv");
const steps = new LiveData(5);
const startL = new LiveData(10);
const endL = new LiveData(90);
const startAngle = new LiveData(30);
const endAngle = new LiveData(30);
const cssChroma = new LiveData(30);
const workingSpace = new LiveData("hex");
const isLightMode = new LiveData(false);
const cssCode = new LiveData("");
const adaptiveCss = new LiveData(false);
const selectedColor = new LiveData(baseColor.value);

const hueSlider = new Slider("hue_range", "hue_text");
const hueModeSelect = document.getElementById("hueMode");
const saturationSlider = new Slider("saturation_range", "saturation_text");
const valueSlider = new Slider("value_range", "value_text");
const lightnessSlider = new Slider("lightness_range", "lightness_text");
const chromacitySlider = new Slider("chromacity_range", "chromacity_text");
const cssChromacitySlider = new Slider("css_chromacity_range", "css_chromacity_text");
const slSlider = new Slider("sl_range", "sl_text");
const elSlider = new Slider("el_range", "el_text");
const startSlider = new Slider("start_range", "start_text");
const endSlider = new Slider("end_range", "end_text");

var cssInput = document.getElementById("base_color");
var cssColorSpace = document.getElementById("cssColorSpace");
var daynightButton = document.getElementById("daynightButton");
var daynightSymbol = document.getElementById("daynightSymbol");
var colorScheme = document.getElementById("preset");
var paletteContainer = document.getElementById("paletteContainer");
var cssCodeContainer = document.getElementById("colors-css");
var rolesContainer = document.getElementById("roles-css");
var toggleAdaptiveIcon = document.getElementById("adaptiveToggleIcon");
var snackbar = document.getElementById("snackbar");
var stepsText = document.getElementById("steps");

var selectedColorPreview = document.getElementById("selectedColorPreview");
var selectedColorCSS = document.getElementById("selectedColorCSS");
var selectedColorHex = document.getElementById("selectedColorHex");

var rolesCssFilename = "roles.css";
var overrideHash = true;

setHash(window.location.hash);
window.addEventListener('hashchange', (e) => {
    setHash(window.location.hash);
});

function addChangeListener(element, func) {
    element.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            func(e);
        }
    });
    element.addEventListener("change", func);
}

function removeChilds(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function updateHueModeCSS(okhsv, okhsl) {
    if (hueMode.value == "hsl") {
        Koilors.setColor("--R", Koilors.fromOkhsl(360 * 0.0, okhsl.s, okhsl.l));
        Koilors.setColor("--YR", Koilors.fromOkhsl(360 * 0.1, okhsl.s, okhsl.l));
        Koilors.setColor("--Y", Koilors.fromOkhsl(360 * 0.2, okhsl.s, okhsl.l));
        Koilors.setColor("--GY", Koilors.fromOkhsl(360 * 0.3, okhsl.s, okhsl.l));
        Koilors.setColor("--G", Koilors.fromOkhsl(360 * 0.4, okhsl.s, okhsl.l));
        Koilors.setColor("--BG", Koilors.fromOkhsl(360 * 0.5, okhsl.s, okhsl.l));
        Koilors.setColor("--B", Koilors.fromOkhsl(360 * 0.6, okhsl.s, okhsl.l));
        Koilors.setColor("--PB", Koilors.fromOkhsl(360 * 0.7, okhsl.s, okhsl.l));
        Koilors.setColor("--P", Koilors.fromOkhsl(360 * 0.8, okhsl.s, okhsl.l));
        Koilors.setColor("--RP", Koilors.fromOkhsl(360 * 0.9, okhsl.s, okhsl.l));
    } else {
        Koilors.setColor("--R", Koilors.fromOkhsv(360 * 0.0, okhsv.s, okhsv.v));
        Koilors.setColor("--YR", Koilors.fromOkhsv(360 * 0.1, okhsv.s, okhsv.v));
        Koilors.setColor("--Y", Koilors.fromOkhsv(360 * 0.2, okhsv.s, okhsv.v));
        Koilors.setColor("--GY", Koilors.fromOkhsv(360 * 0.3, okhsv.s, okhsv.v));
        Koilors.setColor("--G", Koilors.fromOkhsv(360 * 0.4, okhsv.s, okhsv.v));
        Koilors.setColor("--BG", Koilors.fromOkhsv(360 * 0.5, okhsv.s, okhsv.v));
        Koilors.setColor("--B", Koilors.fromOkhsv(360 * 0.6, okhsv.s, okhsv.v));
        Koilors.setColor("--PB", Koilors.fromOkhsv(360 * 0.7, okhsv.s, okhsv.v));
        Koilors.setColor("--P", Koilors.fromOkhsv(360 * 0.8, okhsv.s, okhsv.v));
        Koilors.setColor("--RP", Koilors.fromOkhsv(360 * 0.9, okhsv.s, okhsv.v));
    }
}

var isUpdatingCSS = false;
function updateCSS() {
    if (isUpdatingCSS) {
        return;
    }
    isUpdatingCSS = true;
    setTimeout(function () {
        let okhsv = baseColor.value.okhsv;
        let okhsl = baseColor.value.okhsl;
        Koilors.setColor("--baseColor", baseColor.value);
        Koilors.setColor("--onBaseColor", Koilors.fromOkhsl(okhsl.h, okhsl.s, okhsl.l > 0.5 ? 0.0 : 1.0));

        updateHueModeCSS(okhsv, okhsl);

        Koilors.setColor("--s0", Koilors.fromOkhsv(okhsv.h, 0.0, okhsv.v));
        Koilors.setColor("--s50", Koilors.fromOkhsv(okhsv.h, 0.5, okhsv.v));
        Koilors.setColor("--s100", Koilors.fromOkhsv(okhsv.h, 1.0, okhsv.v));

        Koilors.setColor("--v0", Koilors.fromOkhsv(okhsv.h, okhsv.s, 0.0));
        Koilors.setColor("--v50", Koilors.fromOkhsv(okhsv.h, okhsv.s, 0.5));
        Koilors.setColor("--v100", Koilors.fromOkhsv(okhsv.h, okhsv.s, 1.0));

        Koilors.setColor("--l0", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.0));
        Koilors.setColor("--l25", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.25));
        Koilors.setColor("--l50", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.50));
        Koilors.setColor("--l75", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.75));
        Koilors.setColor("--l100", Koilors.fromOkhsl(okhsl.h, okhsl.s, 1.0));

        Koilors.setColor("--c0", Koilors.fromOkhsl(okhsl.h, 0.0, okhsl.l));
        Koilors.setColor("--c25", Koilors.fromOkhsl(okhsl.h, 0.25, okhsl.l));
        Koilors.setColor("--c50", Koilors.fromOkhsl(okhsl.h, 0.50, okhsl.l));
        Koilors.setColor("--c75", Koilors.fromOkhsl(okhsl.h, 0.75, okhsl.l));
        Koilors.setColor("--c100", Koilors.fromOkhsl(okhsl.h, 1.0, okhsl.l));

        let sl = startL.value / 100.0;
        let el = endL.value / 100.0;

        Koilors.setColor("--hos0", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * -5.0)), okhsl.s, sl));
        Koilors.setColor("--hos10", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * -4.0)), okhsl.s, sl));
        Koilors.setColor("--hos20", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * -3.0)), okhsl.s, sl));
        Koilors.setColor("--hos30", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * -2.0)), okhsl.s, sl));
        Koilors.setColor("--hos40", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * -1.0)), okhsl.s, sl));
        Koilors.setColor("--hos50", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 0.0)), okhsl.s, sl));
        Koilors.setColor("--hos60", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 1.0)), okhsl.s, sl));
        Koilors.setColor("--hos70", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 2.0)), okhsl.s, sl));
        Koilors.setColor("--hos80", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 3.0)), okhsl.s, sl));
        Koilors.setColor("--hos90", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 4.0)), okhsl.s, sl));
        Koilors.setColor("--hos100", Koilors.fromOkhsl(loopDegrees(okhsl.h - (36.0 * 5.0)), okhsl.s, sl));

        Koilors.setColor("--hoe0", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * -5.0)), okhsl.s, el));
        Koilors.setColor("--hoe10", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * -4.0)), okhsl.s, el));
        Koilors.setColor("--hoe20", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * -3.0)), okhsl.s, el));
        Koilors.setColor("--hoe30", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * -2.0)), okhsl.s, el));
        Koilors.setColor("--hoe40", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * -1.0)), okhsl.s, el));
        Koilors.setColor("--hoe50", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 0.0)), okhsl.s, el));
        Koilors.setColor("--hoe60", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 1.0)), okhsl.s, el));
        Koilors.setColor("--hoe70", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 2.0)), okhsl.s, el));
        Koilors.setColor("--hoe80", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 3.0)), okhsl.s, el));
        Koilors.setColor("--hoe90", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 4.0)), okhsl.s, el));
        Koilors.setColor("--hoe100", Koilors.fromOkhsl(loopDegrees(okhsl.h + (36.0 * 5.0)), okhsl.s, el));

        let normalizedChromacity = cssChroma.value / 100.0;

        let startOkhsv = {
            h: loopDegrees(okhsv.h - startAngle.value),
            s: okhsv.s,
            v: okhsv.v
        };
        let endOkhsv = {
            h: loopDegrees(okhsv.h + endAngle.value),
            s: okhsv.s,
            v: okhsv.v
        };

        let startColor = Koilors.fromOkhsv(startOkhsv.h, startOkhsv.s, startOkhsv.v);
        let endColor = Koilors.fromOkhsv(endOkhsv.h, endOkhsv.s, endOkhsv.v);

        Koilors.setColor("--sl0", startColor.getShade(0.0));
        Koilors.setColor("--sl25", startColor.getShade(0.25));
        Koilors.setColor("--sl50", startColor.getShade(0.50));
        Koilors.setColor("--sl75", startColor.getShade(0.75));
        Koilors.setColor("--sl100", startColor.getShade(1.0));

        Koilors.setColor("--el0", endColor.getShade(0.0));
        Koilors.setColor("--el25", endColor.getShade(0.25));
        Koilors.setColor("--el50", endColor.getShade(0.50));
        Koilors.setColor("--el75", endColor.getShade(0.75));
        Koilors.setColor("--el100", endColor.getShade(1.0));

        if (endL.value < startL.value) {
            startColor = Koilors.fromOkhsv(endOkhsv.h, endOkhsv.s, endOkhsv.v);
            endColor = Koilors.fromOkhsv(startOkhsv.h, startOkhsv.s, startOkhsv.v);
        }

        let css = ":root {\n";

        let setAccent = function (name, l, chroma, start, end, base) {
            let accent = Koilors.lerp(start, end, l);
            accent = Koilors.lerp(base, accent, chroma);
            let accentOkhsl = accent.okhsl;
            let color = Koilors.fromOkhsl(accentOkhsl.h, accentOkhsl.s, l);
            Koilors.setColor(name, color);
            return "    " + name + ": " + colorToString(color, workingSpace.value) + ";\n";
        }

        css += setAccent("--A0", 0.0001, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A10", 0.1, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A20", 0.2, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A30", 0.3, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A40", 0.4, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A50", 0.5, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A60", 0.6, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A70", 0.7, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A80", 0.8, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A90", 0.9, normalizedChromacity, startColor, endColor, baseColor.value);
        css += setAccent("--A100", 0.9999, normalizedChromacity, startColor, endColor, baseColor.value) + "\n";

        okhsl.s *= normalizedChromacity;

        let setPrimary = function (name, color) {
            Koilors.setColor(name, color);
            return "    " + name + ": " + colorToString(color, workingSpace.value) + ";\n";
        }

        css += setPrimary("--P0", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.0001));
        css += setPrimary("--P4", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.04));
        css += setPrimary("--P6", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.06));
        css += setPrimary("--P10", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.10));
        css += setPrimary("--P12", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.12));
        css += setPrimary("--P17", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.17));
        css += setPrimary("--P20", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.20));
        css += setPrimary("--P22", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.22));
        css += setPrimary("--P24", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.24));
        css += setPrimary("--P30", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.30));
        css += setPrimary("--P40", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.40));
        css += setPrimary("--P50", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.50));
        css += setPrimary("--P60", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.60));
        css += setPrimary("--P70", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.70));
        css += setPrimary("--P80", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.80));
        css += setPrimary("--P87", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.87));
        css += setPrimary("--P90", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.90));
        css += setPrimary("--P92", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.92));
        css += setPrimary("--P94", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.94));
        css += setPrimary("--P95", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.95));
        css += setPrimary("--P96", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.96));
        css += setPrimary("--P98", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.98));
        css += setPrimary("--P100", Koilors.fromOkhsl(okhsl.h, okhsl.s, 0.9999));

        css += "\n}\n";

        cssCode.value = css;

        isUpdatingCSS = false;
    });
}

function selectBackgroundColor(e) {
    try {
        selectedColor.value = Koilors.fromCSS(e.target.style.backgroundColor);
    } catch {
        let propertyName = e.target.style.backgroundColor.slice(4, -1);
        let computed = window.getComputedStyle(e.target).getPropertyValue(propertyName);
        selectedColor.value = Koilors.fromCSS(computed);
    }
}

var isSnackbarActive = false;
var snackbarTimeoutId = -1;
function showSnackbar(msg) {
    snackbar.innerText = msg;
    if (isSnackbarActive) {
        clearTimeout(snackbarTimeoutId);
    } else {
        isSnackbarActive = true;
        snackbar.classList.add("active");
    }
    snackbarTimeoutId = setTimeout(function () {
        snackbar.classList.remove("active");
        isSnackbarActive = false;
    }, 3141);
}

function copyFrom(elementId, customMessage) {
    let element = document.getElementById(elementId);
    if (!element.innerText) {
        return;
    }
    if (!customMessage) {
        copyFrom(elementId, "Copied: " + element.innerText);
        return;
    }
    let range = document.createRange();
    let selection = window.getSelection();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    try {
        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.writeText(element.innerText).then(
                    () => {
                        /* clipboard successfully set */
                        showSnackbar(customMessage);
                    },
                    () => {
                        /* clipboard write failed */
                        document.execCommand("copy");
                        showSnackbar(customMessage);
                    },
                );
            } else {
                document.execCommand("copy");
                showSnackbar(customMessage);
            }
        });
    } catch {
        document.execCommand("copy");
        showSnackbar(customMessage);
    }
}

var cache = {};
function downloadInto(element, path) {
    if (path in cache) {
        element.innerHTML = cache[path];
        return;
    }
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        cache[path] = this.responseText;
        element.innerText = this.responseText;
    }
    xhttp.open("GET", path, true);
    xhttp.send();
}

function downloadFromElement(filename, elementId) {
    let from = document.getElementById(elementId);
    if (!from.innerText) {
        return;
    }
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(from.innerText));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

var isUpdatingColors = false;
function updatePalette() {
    if (isUpdatingColors) {
        return;
    }
    isUpdatingColors = true;
    setTimeout(function () {
        removeChilds(paletteContainer);

        let okhsv = baseColor.value.okhsv;
        let startOkhsv = {
            h: loopDegrees(okhsv.h - startAngle.value),
            s: okhsv.s,
            v: okhsv.v
        };
        let endOkhsv = {
            h: loopDegrees(okhsv.h + endAngle.value),
            s: okhsv.s,
            v: okhsv.v
        };

        let startColor = Koilors.fromOkhsv(startOkhsv.h, startOkhsv.s, startOkhsv.v);
        let endColor = Koilors.fromOkhsv(endOkhsv.h, endOkhsv.s, endOkhsv.v);

        for (let i = 0; i < steps.value; i++) {

            let t = i / (steps.value - 1);
            let workingColor = Koilors.lerp(startColor, endColor, t);
            workingColor = Koilors.lerp(baseColor.value, workingColor, Math.abs((t * 2.0) - 1.0));
            let workingOkhsl = workingColor.okhsl;

            // l = okhslA.l * oneMinusT + oklabB.l * t;
            workingColor = Koilors.fromOkhsl(workingOkhsl.h, workingOkhsl.s, (startL.value * (1.0 - t) + endL.value * t) / 100.0);

            let div = document.createElement("div");
            div.style.backgroundColor = workingColor.displayColor();
            div.addEventListener("click", selectBackgroundColor);
            paletteContainer.appendChild(div);
        }

        isUpdatingColors = false;
    });
}

function colorToString(koilor, format) {
    switch (format) {
        case "hex":
            let string = koilor.Color.to("srgb").toGamut({ method: "clip" }).toString({ format: "hex" });
            if (string.length == 4) {
                string = string[0] + string[1] + string[1] + string[2] + string[2] + string[3] + string[3];
            }
            return string;
        case "srgb":
            return (Koilors.fromCSS(koilor.Color.to("srgb").toGamut({ method: "clip" }).toString({ format: "hex" }))).Color.toString({
                format: {
                    name: "rgb",
                    coords: [
                        "<number>[0, 255]",
                        "<number>[0, 255]",
                        "<number>[0, 255]"
                    ]
                }
            });
        case "hsv":
            return (Koilors.fromCSS(koilor.Color.toString({ format: "hex" }))).Color.to("hsv").toString({ format: "hsv" });
        case "hsl":
            return (Koilors.fromCSS(koilor.Color.toString({ format: "hex" }))).Color.to("hsl").toString({ format: "hsl" });
        case "hwb":
            return (Koilors.fromCSS(koilor.Color.toString({ format: "hex" }))).Color.to("hwb").toString({ format: "hwb" });
        case "oklab":
            return koilor.Color.to("oklab").toString();
        case "oklch":
            return koilor.Color.to("oklch").toString();
        case "lab":
            return koilor.Color.to("lab").toString();
        case "lch":
            return koilor.Color.to("lch").toString();
        case "p3":
            return koilor.Color.to("p3").toGamut({ method: "clip" }).toString();
        case "rec2020":
            return koilor.Color.to("rec2020").toGamut({ method: "clip" }).toString();
    }
    return koilor.Color.toString({ format: "hex" });
}

function onBaseCssChanged(e) {
    try {
        try {
            baseColor.value = Koilors.fromCSS(cssInput.value);
        } catch (e2) {
            baseColor.value = Koilors.fromCSS("#" + cssInput.value);
        }
    } catch (e) {
        cssInput.value = colorToString(baseColor.value, workingSpace.value);
    }
}
addChangeListener(cssInput, onBaseCssChanged);

function onBaseColorChanged(color) {
    cssInput.value = colorToString(color, workingSpace.value);
    hueSlider.value = Math.round(color.okhsv.h);
    saturationSlider.value = Math.round(color.okhsv.s * 100);
    valueSlider.value = Math.round(color.okhsv.v * 100);
    lightnessSlider.value = Math.round(color.okhsl.l * 100);
    chromacitySlider.value = Math.round(color.okhsl.s * 100);
    updateCSS();
    updateHash();
    updatePalette();
}
baseColor.listen(onBaseColorChanged);

function onHueModeChanged() {
    let okhsv = {
        h: baseColor.value.okhsv.h,
        s: baseColor.value.okhsv.s,
        v: baseColor.value.okhsv.v,
    };
    let okhsl = {
        h: baseColor.value.okhsl.h,
        s: baseColor.value.okhsl.s,
        l: baseColor.value.okhsl.l,
    };
    updateHueModeCSS(okhsv, okhsl);
}
hueMode.listen(onHueModeChanged)

function OnStepsChanged(value) {
    stepsText.value = value;
    updateHash();
    updatePalette();
}
steps.listen(OnStepsChanged);

function onLightnessRangeChanged(ignore) {
    slSlider.value = startL.value;
    elSlider.value = endL.value;
    updateHash();
    updatePalette();
    updateCSS();
}
startL.listen(onLightnessRangeChanged);
endL.listen(onLightnessRangeChanged);

function onAngleRangeChanged(ignore) {
    startSlider.value = startAngle.value;
    endSlider.value = endAngle.value;
    updateHash();
    updatePalette();
    updateCSS();
}
startAngle.listen(onAngleRangeChanged);
endAngle.listen(onAngleRangeChanged);

function onCssChromacityChanged(value) {
    cssChromacitySlider.value = value;
    updateHash();
    updateCSS();
}
cssChroma.listen(onCssChromacityChanged);

function randomizeAngles() {
    startAngle.value = Math.round((Math.random() * 180.0) * ((Math.random() * 2) - 1.0));
    endAngle.value = Math.round((Math.random() * 180.0) * ((Math.random() * 2) - 1.0));
}

function randomizeLightnessRange() {
    let lerp = function (a, b, t) {
        return a * (1.0 - t) + b * t;
    };
    let baseL = 1.0 - (Math.random() * Math.random());
    baseL = lerp(baseColor.value.okhsl.l, baseL, Math.random() * Math.random());
    startL.value = Math.round(lerp(baseL, 0.0, Math.random() * Math.random()) * 100.0);
    endL.value = Math.round(lerp(baseL, 1.0, Math.random() * Math.random()) * 100.0);
}

function randomizeColor() {
    let h = Math.random() * 360.0;
    let s = 1.0 - (Math.random() * Math.random() * Math.random());
    let v = 1.0 - (Math.random() * Math.random());
    baseColor.value = Koilors.fromOkhsv(h, s, v);
}

function randomize() {
    steps.value = Math.round(8.0 * (Math.random() * Math.random())) + 3;
    randomizeAngles();
    randomizeLightnessRange();
    randomizeColor();
    // cssChroma.value = Math.round(100.0 * (Math.random() * Math.random()));
}

function setHash(string) {
    overrideHash = false;
    let keywords = string.split("/");
    randomize();
    try {
        baseColor.value = Koilors.fromCSS(keywords[0]);
    } catch { }
    workingSpace.value = keywords[1] || workingSpace.value;
    switch (keywords[2]) {
        case "la":
            isLightMode.value = true;
            adaptiveCss.value = true;
            break;
        case "l":
            isLightMode.value = true;
            adaptiveCss.value = false;
            break;
        case "da":
            isLightMode.value = false;
            adaptiveCss.value = true;
            break;
        case "d":
            isLightMode.value = false;
            adaptiveCss.value = false;
            break;
        default:
            isLightMode.value = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
            break;
    }

    steps.value = Math.round(Number(keywords[3] || steps.value));
    startL.value = Math.round(Number(keywords[4] || startL.value));
    endL.value = Math.round(Number(keywords[5] || endL.value));
    startAngle.value = Math.round(Number(keywords[6] || startAngle.value));
    endAngle.value = Math.round(Number(keywords[7] || endAngle.value));
    cssChroma.value = Math.round(Number(keywords[8] || cssChroma.value));
    overrideHash = true;
}

function getHash() {
    let code = baseColor.value.Color.to("srgb").toGamut({ method: "clip" }).toString({ format: "hex" });
    if (code.length == 4) {
        code = code[0] + code[1] + code[1] + code[2] + code[2] + code[3] + code[3];
    }
    code += "/" + workingSpace.value;
    code += "/" + (isLightMode.value ? (adaptiveCss.value ? "la" : "l") : (adaptiveCss.value ? "da" : "d"));
    code += "/" + steps.value;
    code += "/" + startL.value;
    code += "/" + endL.value;
    code += "/" + startAngle.value;
    code += "/" + endAngle.value;
    code += "/" + cssChroma.value;
    return code;
}

function updateHash() {
    if (overrideHash) {
        history.replaceState(undefined, undefined, getHash());
    }
}

function onWorkingSpaceChanged() {
    cssInput.value = colorToString(baseColor.value, workingSpace.value);
    cssColorSpace.value = workingSpace.value;
    selectedColorCSS.innerText = colorToString(selectedColor.value, workingSpace.value);
    updateHash();
    updateCSS();
}
workingSpace.listen(onWorkingSpaceChanged);

function toggleDaynight() {
    isLightMode.value = !isLightMode.value;
}

function updateRolesCSS() {
    if (isLightMode.value) {
        rolesCssFilename = adaptiveCss.value ? "roles-adaptive-light.css" : "roles-light.css";
    } else {
        rolesCssFilename = adaptiveCss.value ? "roles-adaptive-dark.css" : "roles-dark.css";
    }
    downloadInto(rolesContainer, "ui/" + rolesCssFilename);
}

isLightMode.listen((x) => {
    if (x) {
        daynightSymbol.innerText = "light_mode";
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
    } else {
        daynightSymbol.innerText = "dark_mode";
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
    }
    updateHash();
    updateRolesCSS();
});

adaptiveCss.listen((x) => {
    if (x) {
        toggleAdaptiveIcon.classList.add("fill");
        toggleAdaptiveIcon.innerHTML = "toggle_on";
    } else {
        toggleAdaptiveIcon.classList.remove("fill");
        toggleAdaptiveIcon.innerHTML = "toggle_off";
    }
    updateHash();
    updateRolesCSS();
});

cssCode.listen((css) => {
    cssCodeContainer.innerHTML = css;
});

hueSlider.addListener(function (e) {
    if (hueMode.value == "hsl") {
        let okhsl = baseColor.value.okhsl;
        okhsl.h = hueSlider.value;
        baseColor.value = Koilors.fromOkhsl(okhsl.h, okhsl.s, okhsl.l);
    } else {
        let okhsv = baseColor.value.okhsv;
        okhsv.h = hueSlider.value;
        baseColor.value = Koilors.fromOkhsv(okhsv.h, okhsv.s, okhsv.v);
    }
});
hueModeSelect.addEventListener("change", function (e) {
    hueMode.value = hueModeSelect.value;
});
cssColorSpace.addEventListener("change", function (e) {
    workingSpace.value = cssColorSpace.value;
});
saturationSlider.addListener(function (e) {
    let okhsv = baseColor.value.okhsv;
    okhsv.s = saturationSlider.value / 100.0;
    baseColor.value = Koilors.fromOkhsv(okhsv.h, okhsv.s, okhsv.v);
});
valueSlider.addListener(function (e) {
    let okhsv = baseColor.value.okhsv;
    okhsv.v = valueSlider.value / 100.0;
    baseColor.value = Koilors.fromOkhsv(okhsv.h, okhsv.s, okhsv.v);
});
lightnessSlider.addListener(function (e) {
    let okhsl = baseColor.value.okhsl;
    okhsl.l = lightnessSlider.value / 100.0;
    baseColor.value = Koilors.fromOkhsl(okhsl.h, okhsl.s, okhsl.l);
});
chromacitySlider.addListener(function (e) {
    let okhsl = baseColor.value.okhsl;
    okhsl.s = chromacitySlider.value / 100.0;
    baseColor.value = Koilors.fromOkhsl(okhsl.h, okhsl.s, okhsl.l);
});

cssChromacitySlider.addListener(function (e) {
    cssChroma.value = cssChromacitySlider.value;
});

slSlider.addListener(function (e) {
    startL.value = Number(e.target.value);
});
elSlider.addListener(function (e) {
    endL.value = Number(e.target.value);
});

startSlider.addListener(function (e) {
    startAngle.value = Number(e.target.value);
});

endSlider.addListener(function (e) {
    endAngle.value = Number(e.target.value);
});

daynightButton.addEventListener("pointerdown", (e) => {
    toggleDaynight();
});

addChangeListener(stepsText, function(e) {
    steps.value = clamp(Number(stepsText.value), 3, 11);
});

colorScheme.addEventListener("change", function (e) {
    switch (e.target.value) {
        case "mono": //Monochromatic
            startAngle.value = 0;
            endAngle.value = 0;
            break;
        case "comp": //Complementary
            startAngle.value = 180;
            endAngle.value = 180;
            break;
        case "anal": //Analogous
            startAngle.value = 30;
            endAngle.value = 30;
            break;
        case "split": //Split Complementary
            startAngle.value = 150;
            endAngle.value = 150;
            break;
        case "tri": //Triadic
            startAngle.value = 120;
            endAngle.value = 120;
            break;
        case "square": //Square
            startAngle.value = -90;
            endAngle.value = -90;
            break;
        case "tetral": //Tetradic Left
            startAngle.value = 60;
            endAngle.value = 120;
            break;
        case "tetrar": //Tetradic Right
            startAngle.value = 120;
            endAngle.value = 60;
            break;
        case "cmpd": //Compound
            startAngle.value = 30;
            endAngle.value = -150;
            break;
        case "poly": //Polychromatic
            startAngle.value = -180;
            endAngle.value = -180;
            break;
        default:
            return;
    }
    colorScheme.value = "";
});

var selectedDialog = document.getElementById("selectedColorDialog");
var ignoreSelectedColorDialog = true;
selectedColor.listen((color) => {
    selectedColorPreview.style.backgroundColor = color.displayColor();
    selectedColorCSS.innerText = colorToString(color, workingSpace.value);
    selectedColorHex.innerText = colorToString(color, workingSpace.value == "hex" ? "srgb" : "hex");

    if(ignoreSelectedColorDialog) {
        ignoreSelectedColorDialog = false;
        return;
    }
    selectedDialog.showModal();

});

window.closeSelectedColor = function () {
    selectedDialog.close();
}

window.copyFrom = copyFrom;
window.downloadInto = downloadInto;
window.randomizeAngles = randomizeAngles;
window.randomizeLightnessRange = randomizeLightnessRange;
window.randomizeColor = randomizeColor;
window.selectBackgroundColor = selectBackgroundColor;
window.downloadFromElement = downloadFromElement;
window.downloadRoles = function () {
    downloadFromElement(rolesCssFilename, "roles-css");
}
window.toggleAdaptiveCss = function () {
    adaptiveCss.value = !adaptiveCss.value;
};

window.increaseSteps = function() {
    if(steps.value < 11) {
        steps.value = steps.value + 1;
    }
};

window.decreaseSteps = function() {
    if(steps.value > 3) {
        steps.value = steps.value - 1;
    }
};