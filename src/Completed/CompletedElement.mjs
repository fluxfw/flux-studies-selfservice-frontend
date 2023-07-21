import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { PAGE_COMPLETED } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { LOCALIZATION_KEY_REGISTRATION_COMPLETED, LOCALIZATION_KEY_THANK_YOU_FOR_YOUR_REGISTRATION } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/CompletedElement.css`
);

export class CompletedElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
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
     * @param {backFunction | null} back_function
     * @returns {CompletedElement}
     */
    static new(flux_localization_api, back_function = null) {
        return new this(
            flux_localization_api,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#back_function = back_function;

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
        this.#shadow.append(TitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_REGISTRATION_COMPLETED
            )
        ));

        this.#shadow.append(SubtitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_THANK_YOU_FOR_YOUR_REGISTRATION
            )
        ));

        this.#shadow.append(await FormElement.new(
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
