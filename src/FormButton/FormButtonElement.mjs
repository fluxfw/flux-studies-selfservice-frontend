/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormButtonElement extends HTMLElement {
    /**
     * @type {HTMLButtonElement}
     */
    #button_element;
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {string}
     */
    #label;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} label
     * @returns {FormButtonElement}
     */
    static new(flux_css_api, label) {
        return new this(
            flux_css_api,
            label
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} label
     * @private
     */
    constructor(flux_css_api, label) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#label = label;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {HTMLButtonElement}
     */
    get button() {
        return this.#button_element;
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#button_element = document.createElement("button");
        this.#button_element.innerText = this.#label;
        this.#button_element.type = "button";
        this.#shadow.appendChild(this.#button_element);
    }
}

export const FORM_BUTTON_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-button";

customElements.define(FORM_BUTTON_ELEMENT_TAG_NAME, FormButtonElement);
