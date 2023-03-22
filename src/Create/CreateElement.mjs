import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_CREATE } from "../Page/PAGE.mjs";

/** @typedef {import("./createFunction.mjs").createFunction} createFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../Password/PasswordService.mjs").PasswordService} PasswordService */
/** @typedef {import("../Start/Start.mjs").Start} Start */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/CreateElement.css`
);

export class CreateElement extends HTMLElement {
    /**
     * @type {createFunction}
     */
    #create_function;
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
     * @param {createFunction} create_function
     * @returns {CreateElement}
     */
    static new(flux_localization_api, label_service, password_service, start, create_function) {
        return new this(
            flux_localization_api,
            label_service,
            password_service,
            start,
            create_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {LabelService} password_service
     * @param {Start} start
     * @param {createFunction} create_function
     * @private
     */
    constructor(flux_localization_api, label_service, password_service, start, create_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#password_service = password_service;
        this.#start = start;
        this.#create_function = create_function;

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
    async #create() {
        if (!await this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#create_function(
            {
                semester: this.#form_element.inputs.semester.value,
                password: await this.#password_service.hashPassword(
                    this.#form_element.inputs.password.value,
                    this.#start
                ),
                "confirm-password": await this.#password_service.hashPassword(
                    this.#form_element.inputs["confirm-password"].value,
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

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                if (this.#form_element.inputs.password.value !== this.#form_element.inputs["confirm-password"].value) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs["confirm-password"],
                        await this.#flux_localization_api.translate(
                            "Confirm password does not match!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Create a new application"
            )
        );

        const semester_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Semester"
            ),
            "select",
            "semester"
        );
        semester_element.required = true;

        for (const semester of this.#start.semesters) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getSemesterLabel(
                semester
            );
            option_element.value = semester.id;
            semester_element.appendChild(option_element);
        }

        this.#form_element.addSubtitle(
            await this.#flux_localization_api.translate(
                "Enter a password with at least {min-password-length} characters which will allow you to access your data at a later stage",
                null,
                {
                    "min-password-length": this.#start["min-password-length"]
                }
            )
        );

        const password_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Password"
            ),
            "password",
            "password"
        );
        password_element.minLength = this.#start["min-password-length"];
        password_element.required = true;

        const confirm_password_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Confirm password"
            ),
            "password",
            "confirm-password"
        );
        confirm_password_element.minLength = this.#start["min-password-length"];
        confirm_password_element.required = true;

        await this.#form_element.addButtons(
            () => {
                this.#create();
            }
        );

        this.#shadow.appendChild(this.#form_element);
    }
}

export const CREATE_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_CREATE}`;

customElements.define(CREATE_ELEMENT_TAG_NAME, CreateElement);
