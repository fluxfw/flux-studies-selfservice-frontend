import { LOCALIZATION_KEY_SELFSERVICE, LOCALIZATION_KEY_STUDIS_SELFSERVICE } from "../Localization/LOCALIZATION_KEY.mjs";

export const MANIFEST_TEMPLATE = Object.freeze({
    background_color: "#ffffff",
    categories: Object.freeze([
        "education"
    ]),
    description: LOCALIZATION_KEY_STUDIS_SELFSERVICE,
    dir: "ltr",
    display: "browser",
    icons: Object.freeze([
        {
            purpose: "any",
            sizes: "any",
            src: "../Icon/icon.svg",
            type: "image/svg+xml"
        },
        {
            purpose: "any",
            sizes: "1024x1024",
            src: "../Icon/icon.webp",
            type: "image/webp"
        },
        {
            purpose: "any",
            sizes: "32x32",
            src: "../favicon.ico",
            type: "image/x-icon"
        }
    ].map(icon => Object.freeze(icon))),
    id: "flux-studis-selfservice",
    lang: "en",
    name: LOCALIZATION_KEY_STUDIS_SELFSERVICE,
    scope: "..",
    short_name: LOCALIZATION_KEY_SELFSERVICE,
    start_url: "..",
    theme_color: "#e3003d"
});
