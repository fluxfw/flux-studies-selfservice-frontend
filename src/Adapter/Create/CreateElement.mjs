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
     * @param {CssApi} css_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @returns {CreateElement}
     */
    static new(css_api, start, create_function) {
        return new this(
            css_api,
            start,
            create_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @private
     */
    constructor(css_api, start, create_function) {
        super();

        this.#css_api = css_api;
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
     * @returns {void}
     */
    #create() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#create_function(
            {
                semester: this.#form_element.inputs.semester.value,
                password: this.#form_element.inputs.password.value,
                "confirm-password": this.#form_element.inputs["confirm-password"].value
            }
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#form_element = FormElement.new(
            this.#css_api,
            "Create a new application",
            () => {
                if (this.#form_element.inputs.password.value !== this.#form_element.inputs["confirm-password"].value) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs["confirm-password"],
                        "Confirm password does not match!"
                    );
                    return false;
                }

                return true;
            }
        );

        const semester_element = this.#form_element.addInput(
            "Semester",
            "select",
            "semester"
        );
        semester_element.required = true;

        for (const semester of this.#start.semesters) {
            const option_element = document.createElement("option");
            option_element.text = semester.label;
            option_element.value = semester.id;
            semester_element.appendChild(option_element);
        }

        this.#form_element.addSubtitle(
            `Enter a password with at least ${this.#start["min-password-length"]} characters which will allow you to access your data at a later stage.`
        );

        const password_element = this.#form_element.addInput(
            "Password",
            "password",
            "password"
        );
        password_element.minLength = this.#start["min-password-length"];
        password_element.required = true;

        const confirm_password_element = this.#form_element.addInput(
            "Confirm password",
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

export const CREATE_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_CREATE}`;

customElements.define(CREATE_ELEMENT_TAG_NAME, CreateElement);
