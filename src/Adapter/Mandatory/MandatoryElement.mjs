/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MandatoryElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @returns {MandatoryElement}
     */
    static new(css_api, localization_api) {
        return new this(
            css_api,
            localization_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(css_api, localization_api) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
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
        mandatory_element.innerText = await this.#localization_api.translate(
            "Mandatory"
        );
        this.#shadow.appendChild(mandatory_element);
    }
}

export const MANDATORY_ELEMENT_TAG_NAME = "flux-studis-selfservice-mandatory";

customElements.define(MANDATORY_ELEMENT_TAG_NAME, MandatoryElement);
