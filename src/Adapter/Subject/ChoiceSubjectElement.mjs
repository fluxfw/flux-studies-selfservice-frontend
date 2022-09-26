import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonsElement } from "../FormButtons/FormButtonsElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";
import { FormTitleElement } from "../FormTitle/FormTitleElement.mjs";
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
     * @type {HTMLFormElement}
     */
    #form_element;
    /**
     * @type {nextFunction}
     */
    #next_function;
    /**
     * @type {HTMLDivElement}
     */
    #qualifications_list_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {HTMLDivElement}
     */
    #subject_list_element;

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
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/../Form/FormElement.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #next() {
        if (!this.#form_element.checkValidity()) {
            this.#form_element.reportValidity();
            return;
        }

        this.#next_function(
            {
                qualifications: Object.fromEntries(("qualification" in this.#form_element.elements ? (this.#form_element.elements.qualification instanceof RadioNodeList ? [
                    ...this.#form_element.elements.qualification
                ] : [
                    this.#form_element.elements.qualification
                ]) : []).map(input_element => [
                    input_element.value,
                    input_element.checked
                ])),
                subject: this.#form_element.elements.subject.value
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

        this.#shadow.appendChild(FormTitleElement.new(
            this.#css_api,
            "Choose your degree program"
        ));

        this.#form_element = document.createElement("form");

        const subjects_section_element = document.createElement("div");

        this.#subject_list_element = document.createElement("div");

        for (const subject of this.#choice_subject.subjects) {
            const label_element = document.createElement("label");

            const input_element = document.createElement("input");
            input_element.classList.add("input");
            input_element.name = "subject";
            input_element.required = true;
            input_element.type = "radio";
            input_element.value = subject.id;
            input_element.addEventListener("input", () => {
                this.#renderQualifications(
                    subject
                );
            });
            label_element.appendChild(input_element);

            const text_element = document.createElement("div");
            text_element.classList.add("text");
            text_element.innerText = subject.label;
            label_element.appendChild(text_element);

            this.#subject_list_element.appendChild(label_element);
        }

        subjects_section_element.appendChild(this.#subject_list_element);

        this.#form_element.appendChild(subjects_section_element);

        this.#form_element.appendChild(FormSubtitleElement.new(
            this.#css_api,
            "Qualifications for admission"
        ));

        const qualifications_section_element = document.createElement("div");

        this.#qualifications_list_element = document.createElement("div");
        qualifications_section_element.appendChild(this.#qualifications_list_element);

        this.#form_element.appendChild(qualifications_section_element);

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(FormButtonsElement.new(
            [
                {
                    action: () => {
                        this.#next();
                    },
                    label: "Continue"
                }
            ],
            this.#css_api
        ));

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));
    }

    /**
     * @param {Subject} subject
     * @returns {void}
     */
    #renderQualifications(subject) {
        this.#qualifications_list_element.innerHTML = "";

        for (const qualification of subject.qualifications) {
            const label_element = document.createElement("label");

            const input_element = document.createElement("input");
            input_element.classList.add("input");
            input_element.name = "qualification";
            input_element.required = qualification.required ?? false;
            input_element.type = "checkbox";
            input_element.value = qualification.id;
            label_element.appendChild(input_element);

            const text_element = document.createElement("div");
            text_element.classList.add("text");
            text_element.innerText = qualification.label;
            label_element.appendChild(text_element);

            this.#qualifications_list_element.appendChild(label_element);
        }
    }
}

export const CHOICE_SUBJECT_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}choice-subject`;

customElements.define(CHOICE_SUBJECT_ELEMENT_TAG_NAME, ChoiceSubjectElement);
