/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormInvalidElement extends HTMLElement {
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {string}
     */
    #message;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} message
     * @returns {FormInvalidElement}
     */
    static new(flux_css_api, message) {
        return new this(
            flux_css_api,
            message
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} message
     * @private
     */
    constructor(flux_css_api, message) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#message = message;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
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
