import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormButtonElement extends HTMLElement {
    /**
     * @type {HTMLButtonElement}
     */
    #button_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {string}
     */
    #label;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {string} label
     * @returns {FormButtonElement}
     */
    static new(css_api, label) {
        return new this(
            css_api,
            label
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} label
     * @private
     */
    constructor(css_api, label) {
        super();

        this.#css_api = css_api;
        this.#label = label;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
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

export const FORM_BUTTON_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form-button`;

customElements.define(FORM_BUTTON_ELEMENT_TAG_NAME, FormButtonElement);
