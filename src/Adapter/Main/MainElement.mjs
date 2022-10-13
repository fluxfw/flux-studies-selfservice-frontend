import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs").ColorSchemeApi} ColorSchemeApi */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../Api/StudiesSelfserviceFrontendApi.mjs").StudiesSelfserviceFrontendApi} StudiesSelfserviceFrontendApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MainElement extends HTMLElement {
    /**
     * @type {ColorSchemeApi}
     */
    #color_scheme_api;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {StudiesSelfserviceFrontendApi}
     */
    #studies_selfservice_frontend_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {ColorSchemeApi} color_scheme_api
     * @param {CssApi} css_api
     * @param {StudiesSelfserviceFrontendApi} studies_selfservice_frontend_api
     * @returns {MainElement}
     */
    static new(color_scheme_api, css_api, studies_selfservice_frontend_api) {
        return new this(
            color_scheme_api,
            css_api,
            studies_selfservice_frontend_api
        );
    }

    /**
     * @param {ColorSchemeApi} color_scheme_api
     * @param {CssApi} css_api
     * @param {StudiesSelfserviceFrontendApi} studies_selfservice_frontend_api
     * @private
     */
    constructor(color_scheme_api, css_api, studies_selfservice_frontend_api) {
        super();

        this.#color_scheme_api = color_scheme_api;
        this.#css_api = css_api;
        this.#studies_selfservice_frontend_api = studies_selfservice_frontend_api;

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
        const settings_element = document.createElement("div");
        settings_element.classList.add("settings");
        settings_element.appendChild(this.#studies_selfservice_frontend_api.getSelectLanguageButtonElement());
        settings_element.appendChild(this.#color_scheme_api.getSelectColorSchemeElement());
        this.#shadow.appendChild(settings_element);

        this.#shadow.appendChild(document.createElement("div"));
    }
}

export const MAIN_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}main`;

customElements.define(MAIN_ELEMENT_TAG_NAME, MainElement);
