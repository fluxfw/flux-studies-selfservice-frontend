import { flux_import_css } from "../Libs/flux-style-sheet-manager/src/FluxImportCss.mjs";

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/SubtitleElement.css`
);

export class SubtitleElement extends HTMLElement {
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string}
     */
    #subtitle;

    /**
     * @param {string} subtitle
     * @returns {SubtitleElement}
     */
    static new(subtitle) {
        return new this(
            subtitle
        );
    }

    /**
     * @param {string} subtitle
     * @private
     */
    constructor(subtitle) {
        super();

        this.#subtitle = subtitle;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        const subtitle_element = document.createElement("span");
        subtitle_element.innerText = this.#subtitle;
        this.#shadow.append(subtitle_element);
    }
}

export const SUBTITLE_ELEMENT_TAG_NAME = "flux-studis-selfservice-subtitle";

customElements.define(SUBTITLE_ELEMENT_TAG_NAME, SubtitleElement);
