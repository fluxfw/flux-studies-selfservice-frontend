import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormInvalidElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {string}
     */
    #message;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {string} message
     * @returns {FormInvalidElement}
     */
    static new(css_api, message) {
        return new this(
            css_api,
            message
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} message
     * @private
     */
    constructor(css_api, message) {
        super();

        this.#css_api = css_api;
        this.#message = message;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
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

export const FORM_INVALID_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form-invalid`;

customElements.define(FORM_INVALID_ELEMENT_TAG_NAME, FormInvalidElement);
