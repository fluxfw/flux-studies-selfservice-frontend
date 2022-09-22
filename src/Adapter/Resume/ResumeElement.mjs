import { CssApi } from "../../../../flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_RESUME } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";

/** @typedef {import("./resumeFunction.mjs").resumeFunction} resumeFunction */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ResumeElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {resumeFunction}
     */
    #resume_function;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {resumeFunction} resume_function
     * @returns {ResumeElement}
     */
    static new(css_api, resume_function) {
        return new this(
            css_api,
            resume_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {resumeFunction} resume_function
     * @private
     */
    constructor(css_api, resume_function) {
        super();

        this.#css_api = css_api;
        this.#resume_function = resume_function;

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
            [
                {
                    action: () => {
                        this.#resume();
                    },
                    label: "Continue"
                }
            ],
            this.#css_api,
            "Resume the application process"
        );

        this.#form_element.addSubtitle(
            "Resume from where you left off!"
        );

        const identification_number_element = this.#form_element.addInput(
            "Identification number",
            "identification_number",
            "text"
        );
        identification_number_element.required = true;

        const password_element = this.#form_element.addInput(
            "Password",
            "password",
            "password"
        );
        password_element.minLength = 8;
        password_element.required = true;

        this.#shadow.appendChild(this.#form_element);
    }

    /**
     * @returns {void}
     */
    #resume() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#resume_function(
            {
                identification_number: this.#form_element.inputs.identification_number.value,
                password: this.#form_element.inputs.password.value
            }
        );
    }
}

export const RESUME_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_RESUME}`;

customElements.define(RESUME_ELEMENT_TAG_NAME, ResumeElement);
