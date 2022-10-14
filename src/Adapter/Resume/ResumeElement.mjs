import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_RESUME } from "../Page/PAGE.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./resumeFunction.mjs").resumeFunction} resumeFunction */
/** @typedef {import("../Start/Start.mjs").Start} Start */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ResumeElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {resumeFunction}
     */
    #resume_function;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {Start}
     */
    #start;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {Start} start
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @returns {ResumeElement}
     */
    static new(css_api, localization_api, start, resume_function, back_function = null) {
        return new this(
            css_api,
            localization_api,
            start,
            resume_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {Start} start
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, localization_api, start, resume_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#start = start;
        this.#resume_function = resume_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Resume the application process"
            )
        );

        this.#form_element.addSubtitle(
            this.#localization_api.translate(
                "Resume from where you left off!"
            )
        );

        const identification_number_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Identification number"
            ),
            "text",
            "identification-number"
        );
        identification_number_element.required = true;

        const password_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Password"
            ),
            "password",
            "password"
        );
        password_element.minLength = this.#start["min-password-length"];
        password_element.required = true;

        this.#form_element.addButtons(
            () => {
                this.#resume();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);
    }

    /**
     * @returns {Promise<void>}
     */
    async #resume() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#resume_function(
            {
                "identification-number": this.#form_element.inputs["identification-number"].value,
                password: this.#form_element.inputs.password.value
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#form_element.addInvalidMessage(
            this.#localization_api.translate(
                "Please check your data!"
            )
        );
    }
}

export const RESUME_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_RESUME}`;

customElements.define(RESUME_ELEMENT_TAG_NAME, ResumeElement);
