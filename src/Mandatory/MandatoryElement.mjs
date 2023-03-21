import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/MandatoryElement.css`
);

export class MandatoryElement extends HTMLElement {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {MandatoryElement}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        super();

        this.#flux_localization_api = flux_localization_api;

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
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
