import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_RESUME } from "../Page/PAGE.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../Password/PasswordService.mjs").PasswordService} PasswordService */
/** @typedef {import("./resumeFunction.mjs").resumeFunction} resumeFunction */
/** @typedef {import("../Start/Start.mjs").Start} Start */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/ResumeElement.css`
);

export class ResumeElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {PasswordService}
     */
    #password_service;
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
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {LabelService} password_service
     * @param {Start} start
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @returns {ResumeElement}
     */
    static new(flux_localization_api, label_service, password_service, start, resume_function, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            password_service,
            start,
            resume_function,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {LabelService} password_service
     * @param {Start} start
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, password_service, start, resume_function, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#password_service = password_service;
        this.#start = start;
        this.#resume_function = resume_function;
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
        this.#form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Resume the application process"
            )
        );

        this.#form_element.addSubtitle(
            await this.#flux_localization_api.translate(
                "Resume from where you left off"
            )
        );

        const identification_number_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Identification number"
            ),
            "text",
            "identification-number"
        );
        identification_number_element.required = true;

        const password_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Password"
            ),
            "password",
            "password"
        );
        password_element.minLength = this.#start["min-password-length"];
        password_element.required = true;

        await this.#form_element.addButtons(
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
        if (!await this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#resume_function(
            {
                "identification-number": this.#form_element.inputs["identification-number"].value,
                password: await this.#password_service.hashPassword(
                    this.#form_element.inputs.password.value,
                    this.#start
                )
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                this.#form_element.addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                );
            }
        } else {
            this.#form_element.addInvalidMessage(
                await this.#flux_localization_api.translate(
                    "Please check your data!"
                )
            );
        }
    }
}

export const RESUME_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_RESUME}`;

customElements.define(RESUME_ELEMENT_TAG_NAME, ResumeElement);
