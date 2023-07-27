import { flux_import_css } from "../Libs/flux-style-sheet-manager/src/FluxImportCss.mjs";
import { LOCALIZATION_KEY_MANDATORY } from "../Localization/LOCALIZATION_KEY.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";

/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/MandatoryElement.css`
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

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const mandatory_element = document.createElement("span");
        mandatory_element.innerText = await this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_MANDATORY
        );
        this.#shadow.append(mandatory_element);
    }
}

export const MANDATORY_ELEMENT_TAG_NAME = "flux-studis-selfservice-mandatory";

customElements.define(MANDATORY_ELEMENT_TAG_NAME, MandatoryElement);
