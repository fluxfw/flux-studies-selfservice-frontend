/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class TitleElement extends HTMLElement {
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string}
     */
    #title;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} title
     * @returns {TitleElement}
     */
    static new(flux_css_api, title) {
        return new this(
            flux_css_api,
            title
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {string} title
     * @private
     */
    constructor(flux_css_api, title) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#title = title;

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
        const title_element = document.createElement("span");
        title_element.innerText = this.#title;
        this.#shadow.appendChild(title_element);
    }
}

export const TITLE_ELEMENT_TAG_NAME = "flux-studis-selfservice-title";

customElements.define(TITLE_ELEMENT_TAG_NAME, TitleElement);
