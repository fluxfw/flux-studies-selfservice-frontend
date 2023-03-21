import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/SubtitleElement.css`
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

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        const subtitle_element = document.createElement("span");
        subtitle_element.innerText = this.#subtitle;
        this.#shadow.appendChild(subtitle_element);
    }
}

export const SUBTITLE_ELEMENT_TAG_NAME = "flux-studis-selfservice-subtitle";

customElements.define(SUBTITLE_ELEMENT_TAG_NAME, SubtitleElement);
