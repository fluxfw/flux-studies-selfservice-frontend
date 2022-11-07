import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_CREATE } from "../Page/PAGE.mjs";

/** @typedef {import("./createFunction.mjs").createFunction} createFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../Start/Start.mjs").Start} Start */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class CreateElement extends HTMLElement {
    /**
     * @type {createFunction}
     */
    #create_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
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
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @returns {CreateElement}
     */
    static new(css_api, label_service, localization_api, start, create_function) {
        return new this(
            css_api,
            label_service,
            localization_api,
            start,
            create_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @private
     */
    constructor(css_api, label_service, localization_api, start, create_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#start = start;
        this.#create_function = create_function;

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
    async #create() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#create_function(
            {
                semester: this.#form_element.inputs.semester.value,
                password: this.#form_element.inputs.password.value,
                "confirm-password": this.#form_element.inputs["confirm-password"].value
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
                this.#localization_api.translate(
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
            this.#css_api,
            this.#localization_api,
            () => {
                if (this.#form_element.inputs.password.value !== this.#form_element.inputs["confirm-password"].value) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs["confirm-password"],
                        this.#localization_api.translate(
                            "Confirm password does not match!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Create a new application"
            )
        );

        const semester_element = this.#form_element.addInput(
            this.#localization_api.translate(
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
            this.#localization_api.translate(
                "Enter a password with at least {min-password-length} characters which will allow you to access your data at a later stage",
                null,
                {
                    "min-password-length": this.#start["min-password-length"]
                }
            )
        );

        const password_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Password"
            ),
            "password",
            "password"
        );
        password_element.minLength = this.#start["min-password-length"];
        password_element.required = true;

        const confirm_password_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Confirm password"
            ),
            "password",
            "confirm-password"
        );
        confirm_password_element.minLength = this.#start["min-password-length"];
        confirm_password_element.required = true;

        this.#form_element.addButtons(
            () => {
                this.#create();
            }
        );

        this.#shadow.appendChild(this.#form_element);
    }
}

export const CREATE_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_CREATE}`;

customElements.define(CREATE_ELEMENT_TAG_NAME, CreateElement);
