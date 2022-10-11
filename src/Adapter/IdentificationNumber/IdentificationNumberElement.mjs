import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_IDENTIFICATION_NUMBER } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./continueFunction.mjs").continueFunction} continueFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./IdentificationNumber.mjs").IdentificationNumber} IdentificationNumber */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class IdentificationNumberElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {continueFunction}
     */
    #continue_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {IdentificationNumber}
     */
    #identification_number;
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
     * @param {IdentificationNumber} identification_number
     * @param {continueFunction} continue_function
     * @param {backFunction | null} back_function
     * @returns {IdentificationNumberElement}
     */
    static new(css_api, localization_api, identification_number, continue_function, back_function = null) {
        return new this(
            css_api,
            localization_api,
            identification_number,
            continue_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {IdentificationNumber} identification_number
     * @param {continueFunction} continue_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, localization_api, identification_number, continue_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#identification_number = identification_number;
        this.#continue_function = continue_function;
        this.#back_function = back_function;

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
    async #continue() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#continue_function();

        if (post_result.ok) {
            return;
        }

        if (post_result.network) {
            this.#shadow.prepend(this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            ));
            return;
        }

        if (post_result.server) {
            this.#shadow.prepend(this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            ));
            return;
        }

        this.#shadow.prepend(this.#form_element.addInvalidMessage(
            this.#localization_api.translate(
                "Please check your data!"
            )
        ));
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Your personal identification number"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Your data will be saved under the following number"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        const identification_number_element = SubtitleElement.new(
            this.#css_api,
            this.#identification_number["identification-number"]
        );
        identification_number_element.classList.add("identification-number");
        this.#shadow.appendChild(identification_number_element);

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Please keep your identification number safe so that you can access your data at a later stage"
            )
        ));

        this.#shadow.appendChild(this.#form_element.addButtons(
            () => {
                this.#continue();
            },
            this.#back_function
        ));
    }
}

export const IDENTIFICATION_NUMBER_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_IDENTIFICATION_NUMBER}`;

customElements.define(IDENTIFICATION_NUMBER_ELEMENT_TAG_NAME, IdentificationNumberElement);
