import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_IDENTIFICATION_NUMBER } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./confirmedIdentificationNumberFunction.mjs").confirmedIdentificationNumberFunction} confirmedIdentificationNumberFunction */
/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./IdentificationNumber.mjs").IdentificationNumber} IdentificationNumber */
/** @typedef {import("../Label/Port/LabelService.mjs").LabelService} LabelService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class IdentificationNumberElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {confirmedIdentificationNumberFunction}
     */
    #confirmed_identification_number_function;
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {IdentificationNumber}
     */
    #identification_number;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {IdentificationNumber} identification_number
     * @param {confirmedIdentificationNumberFunction} confirmed_identification_number_function
     * @param {backFunction | null} back_function
     * @returns {IdentificationNumberElement}
     */
    static new(flux_css_api, flux_localization_api, label_service, identification_number, confirmed_identification_number_function, back_function = null) {
        return new this(
            flux_css_api,
            flux_localization_api,
            label_service,
            identification_number,
            confirmed_identification_number_function,
            back_function
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {IdentificationNumber} identification_number
     * @param {confirmedIdentificationNumberFunction} confirmed_identification_number_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_css_api, flux_localization_api, label_service, identification_number, confirmed_identification_number_function, back_function) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#identification_number = identification_number;
        this.#confirmed_identification_number_function = confirmed_identification_number_function;
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
    async #confirmedIdentificationNumber() {
        if (!await this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#confirmed_identification_number_function(
            {}
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                this.#shadow.prepend(this.#form_element.addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                ));
            }
        } else {
            this.#shadow.prepend(this.#form_element.addInvalidMessage(
                await this.#flux_localization_api.translate(
                    "Please check your data!"
                )
            ));
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Your personal identification number"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Your data will be saved under the following number"
            )
        ));

        this.#form_element = FormElement.new(
            this.#flux_css_api,
            this.#flux_localization_api
        );

        const identification_number_element = SubtitleElement.new(
            this.#flux_css_api,
            this.#identification_number["identification-number"]
        );
        identification_number_element.classList.add("identification-number");
        this.#shadow.appendChild(identification_number_element);

        this.#shadow.appendChild(SubtitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Please keep your identification number safe so that you can access your data at a later stage"
            )
        ));

        this.#shadow.appendChild(await this.#form_element.addButtons(
            () => {
                this.#confirmedIdentificationNumber();
            },
            this.#back_function
        ));
    }
}

export const IDENTIFICATION_NUMBER_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_IDENTIFICATION_NUMBER}`;

customElements.define(IDENTIFICATION_NUMBER_ELEMENT_TAG_NAME, IdentificationNumberElement);
