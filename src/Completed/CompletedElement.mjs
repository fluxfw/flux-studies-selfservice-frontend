import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_COMPLETED } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class CompletedElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
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
     * @param {backFunction | null} back_function
     * @returns {CompletedElement}
     */
    static new(flux_css_api, flux_localization_api, back_function = null) {
        return new this(
            flux_css_api,
            flux_localization_api,
            back_function
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_css_api, flux_localization_api, back_function) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#back_function = back_function;

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
        this.#shadow.appendChild(TitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Registration completed"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Thank you for your registration"
            )
        ));

        this.#shadow.appendChild(await FormElement.new(
            this.#flux_css_api,
            this.#flux_localization_api
        )
            .addButtons(
                null,
                this.#back_function
            ));
    }
}

export const COMPLETED_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_COMPLETED}`;

customElements.define(COMPLETED_ELEMENT_TAG_NAME, CompletedElement);
