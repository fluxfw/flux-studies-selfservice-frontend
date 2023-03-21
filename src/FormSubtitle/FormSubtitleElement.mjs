import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/FormSubtitleElement.css`
);

export class FormSubtitleElement extends HTMLElement {
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
     * @returns {FormSubtitleElement}
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
     * @param {HTMLElement} element
     * @returns {void}
     */
    addElement(element) {
        this.#shadow.appendChild(element);
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

export const FORM_SUBTITLE_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-subtitle";

customElements.define(FORM_SUBTITLE_ELEMENT_TAG_NAME, FormSubtitleElement);
