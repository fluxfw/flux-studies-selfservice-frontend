import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MainElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {SelectLanguageButtonElement}
     */
    #select_language_button_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {SelectLanguageButtonElement} select_language_button_element
     * @returns {MainElement}
     */
    static new(css_api, select_language_button_element) {
        return new this(
            css_api,
            select_language_button_element
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {SelectLanguageButtonElement} select_language_button_element
     * @private
     */
    constructor(css_api, select_language_button_element) {
        super();

        this.#css_api = css_api;
        this.#select_language_button_element = select_language_button_element;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {HTMLElement} element
     * @returns {void}
     */
    replaceContent(element) {
        this.#shadow.lastElementChild.replaceWith(element);
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(this.#select_language_button_element);

        this.#shadow.appendChild(document.createElement("div"));
    }
}

export const MAIN_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}main`;

customElements.define(MAIN_ELEMENT_TAG_NAME, MainElement);
