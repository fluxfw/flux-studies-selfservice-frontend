import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/FormInvalidElement.css`
);

export class FormInvalidElement extends HTMLElement {
    /**
     * @type {string}
     */
    #message;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {string} message
     * @returns {FormInvalidElement}
     */
    static new(message) {
        return new this(
            message
        );
    }

    /**
     * @param {string} message
     * @private
     */
    constructor(message) {
        super();

        this.#message = message;

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
        const invalid_element = document.createElement("span");
        invalid_element.innerText = this.#message;
        this.#shadow.appendChild(invalid_element);
    }
}

export const FORM_INVALID_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-invalid";

customElements.define(FORM_INVALID_ELEMENT_TAG_NAME, FormInvalidElement);
