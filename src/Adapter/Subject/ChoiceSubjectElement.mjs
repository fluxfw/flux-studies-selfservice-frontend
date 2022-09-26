import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("./ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("./nextFunction.mjs").nextFunction} nextFunction */
/** @typedef {import("./Subject.mjs").Subject} Subject */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ChoiceSubjectElement extends HTMLElement {
    /**
     * @type {ChoiceSubject}
     */
    #choice_subject;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {nextFunction}
     */
    #next_function;
    /**
     * @type {FormElement}
     */
    #qualifications_form_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {FormElement}
     */
    #subject_form_element;

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {CssApi} css_api
     * @param {nextFunction} next_function
     * @returns {ChoiceSubjectElement}
     */
    static new(choice_subject, css_api, next_function) {
        return new this(
            choice_subject,
            css_api,
            next_function
        );
    }

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {CssApi} css_api
     * @param {nextFunction} next_function
     * @private
     */
    constructor(choice_subject, css_api, next_function) {
        super();

        this.#choice_subject = choice_subject;
        this.#css_api = css_api;
        this.#next_function = next_function;

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
    #next() {
        if (!this.#subject_form_element.validate() || !this.#qualifications_form_element.validate()) {
            return;
        }

        this.#next_function(
            {
                qualifications: Object.fromEntries(("qualification" in this.#qualifications_form_element.inputs ? (this.#qualifications_form_element.inputs.qualification instanceof RadioNodeList ? [
                    ...this.#qualifications_form_element.inputs.qualification
                ] : [
                    this.#qualifications_form_element.inputs.qualification
                ]) : []).map(input_element => [
                    input_element.value,
                    input_element.checked
                ])),
                subject: this.#subject_form_element.inputs.subject.value
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

        this.#subject_form_element = FormElement.new(
            this.#css_api,
            "Choose your degree program"
        );

        for (const subject of this.#choice_subject.subjects) {
            const input_element = this.#subject_form_element.addInput(subject.label, "subject", "radio");
            input_element.required = true;
            input_element.value = subject.id;
            input_element.addEventListener("input", () => {
                this.#renderQualifications(
                    subject
                );
            });
        }

        this.#shadow.appendChild(this.#subject_form_element);

        this.#qualifications_form_element = FormElement.new(
            this.#css_api,
            "Qualifications for admission",
            [
                {
                    action: () => {
                        this.#next();
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
     * @param {Subject} subject
     * @returns {void}
     */
    #renderQualifications(subject) {
        this.#qualifications_form_element.clearInputs();

        for (const qualification of subject.qualifications) {
            const input_element = this.#qualifications_form_element.addInput(qualification.label, "qualification", "checkbox");
            input_element.required = qualification.required ?? false;
            input_element.value = qualification.id;
        }
    }
}

export const CHOICE_SUBJECT_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}choice-subject`;

customElements.define(CHOICE_SUBJECT_ELEMENT_TAG_NAME, ChoiceSubjectElement);
