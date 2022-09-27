import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_CHOICE_SUBJECT } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("./ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("./continueFunction.mjs").continueFunction} continueFunction */
/** @typedef {import("../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ChoiceSubjectElement extends HTMLElement {
    /**
     * @type {ChoiceSubject}
     */
    #choice_subject;
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
    #degree_program_form_element;
    /**
     * @type {FormElement}
     */
    #qualifications_form_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {continueFunction} continue_function
     * @param {CssApi} css_api
     * @returns {ChoiceSubjectElement}
     */
    static new(choice_subject, continue_function, css_api) {
        return new this(
            choice_subject,
            continue_function,
            css_api
        );
    }

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {continueFunction} continue_function
     * @param {CssApi} css_api
     * @private
     */
    constructor(choice_subject, continue_function, css_api) {
        super();

        this.#choice_subject = choice_subject;
        this.#continue_function = continue_function;
        this.#css_api = css_api;

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
    #continue() {
        if (!this.#degree_program_form_element.validate() || !this.#qualifications_form_element.validate()) {
            return;
        }

        this.#continue_function(
            {
                "degree-program": this.#degree_program_form_element.inputs["degree-program"].value,
                qualifications: Object.fromEntries(("qualification" in this.#qualifications_form_element.inputs ? (this.#qualifications_form_element.inputs.qualification instanceof RadioNodeList ? [
                    ...this.#qualifications_form_element.inputs.qualification
                ] : [
                    this.#qualifications_form_element.inputs.qualification
                ]) : []).map(input_element => [
                    input_element.value,
                    input_element.checked
                ]))
            }
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            "Choice of subject"
        ));

        this.#degree_program_form_element = FormElement.new(
            this.#css_api,
            "Choose your degree program"
        );

        for (const degree_program of this.#choice_subject["degree-programs"]) {
            const input_element = this.#degree_program_form_element.addInput(degree_program.label, "degree-program", "radio");
            input_element.required = true;
            input_element.value = degree_program.id;
            input_element.addEventListener("input", () => {
                this.#renderQualifications(
                    degree_program
                );
            });
        }

        this.#shadow.appendChild(this.#degree_program_form_element);

        this.#qualifications_form_element = FormElement.new(
            this.#css_api,
            "Qualifications for admission",
            [
                {
                    action: () => {
                        this.#continue();
                    },
                    label: "Continue"
                }
            ]
        );

        this.#shadow.appendChild(this.#qualifications_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {void}
     */
    #renderQualifications(degree_program) {
        this.#qualifications_form_element.clearInputs();

        for (const qualification of degree_program.qualifications) {
            const input_element = this.#qualifications_form_element.addInput(qualification.label, "qualification", "checkbox");
            input_element.required = qualification.required ?? false;
            input_element.value = qualification.id;
        }
    }
}

export const CHOICE_SUBJECT_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_CHOICE_SUBJECT}`;

customElements.define(CHOICE_SUBJECT_ELEMENT_TAG_NAME, ChoiceSubjectElement);
