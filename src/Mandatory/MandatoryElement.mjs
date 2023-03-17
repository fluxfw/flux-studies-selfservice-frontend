/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MandatoryElement extends HTMLElement {
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {MandatoryElement}
     */
    static new(flux_css_api, flux_localization_api) {
        return new this(
            flux_css_api,
            flux_localization_api
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_css_api, flux_localization_api) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const mandatory_element = document.createElement("span");
        mandatory_element.innerText = await this.#flux_localization_api.translate(
            "Mandatory"
        );
        this.#shadow.appendChild(mandatory_element);
    }
}

export const MANDATORY_ELEMENT_TAG_NAME = "flux-studis-selfservice-mandatory";

customElements.define(MANDATORY_ELEMENT_TAG_NAME, MandatoryElement);
