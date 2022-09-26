import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_CREATE } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";

/** @typedef {import("./createFunction.mjs").createFunction} createFunction */
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
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {Start}
     */
    #start;

    /**
     * @param {createFunction} create_function
     * @param {CssApi} css_api
     * @param {Start} start
     * @returns {CreateElement}
     */
    static new(create_function, css_api, start) {
        return new this(
            create_function,
            css_api,
            start
        );
    }

    /**
     * @param {createFunction} create_function
     * @param {CssApi} css_api
     * @param {Start} start
     * @private
     */
    constructor(create_function, css_api, start) {
        super();

        this.#create_function = create_function;
        this.#css_api = css_api;
        this.#start = start;

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
    #create() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#create_function(
            {
                confirm_password: this.#form_element.inputs.confirm_password.value,
                password: this.#form_element.inputs.password.value,
                semester: this.#form_element.inputs.semester.value
            }
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#form_element = FormElement.new(
            [
                {
                    action: () => {
                        this.#create();
                    },
                    label: "Continue"
                }
            ],
            this.#css_api,
            "Create a new application",
            () => {
                if (this.#form_element.inputs.password.value !== this.#form_element.inputs.confirm_password.value) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs.confirm_password,
                        "Confirm password does not match!"
                    );
                    return false;
                }

                return true;
            }
        );

        const semester_element = this.#form_element.addInput(
            "Semester",
            "semester",
            "select"
        );
        semester_element.required = true;

        const semester_option_element = document.createElement("option");
        semester_option_element.text = "--";
        semester_option_element.value = "";
        semester_element.appendChild(semester_option_element);
        for (const semester of this.#start.semesters) {
            const option_element = document.createElement("option");
            option_element.text = semester.label;
            option_element.value = semester.id;
            semester_element.appendChild(option_element);
        }

        this.#form_element.addSubtitle(
            `Enter a password with at least ${this.#start.minPasswordLength} characters which will allow you to access your data at a later stage.`
        );

        const password_element = this.#form_element.addInput(
            "Password",
            "password",
            "password"
        );
        password_element.minLength = this.#start.minPasswordLength;
        password_element.required = true;

        const confirm_password_element = this.#form_element.addInput(
            "Confirm password",
            "confirm_password",
            "password"
        );
        confirm_password_element.minLength = this.#start.minPasswordLength;
        confirm_password_element.required = true;

        this.#shadow.appendChild(this.#form_element);
    }
}

export const CREATE_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_CREATE}`;

customElements.define(CREATE_ELEMENT_TAG_NAME, CreateElement);
