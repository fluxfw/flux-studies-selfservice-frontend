import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_INTENDED_DEGREE_PROGRAM } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./continueFunction.mjs").continueFunction} continueFunction */
/** @typedef {import("./IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class IntendedDegreeProgramElement extends HTMLElement {
    /**
     * @type {backFunction}
     */
    #back_function;
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
    #form_element;
    /**
     * @type {IntendedDegreeProgram}
     */
    #intended_degree_program;
    /**
     * @type {HTMLDivElement}
     */
    #mandatory_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {Subject | null}
     */
    #subject;

    /**
     * @param {backFunction} back_function
     * @param {continueFunction} continue_function
     * @param {CssApi} css_api
     * @param {IntendedDegreeProgram} intended_degree_program
     * @returns {IntendedDegreeProgramElement}
     */
    static new(back_function, continue_function, css_api, intended_degree_program) {
        return new this(
            back_function,
            continue_function,
            css_api,
            intended_degree_program
        );
    }

    /**
     * @param {backFunction} back_function
     * @param {continueFunction} continue_function
     * @param {CssApi} css_api
     * @param {IntendedDegreeProgram} intended_degree_program
     * @private
     */
    constructor(back_function, continue_function, css_api, intended_degree_program) {
        super();

        this.#back_function = back_function;
        this.#continue_function = continue_function;
        this.#css_api = css_api;
        this.#intended_degree_program = intended_degree_program;
        this.#subject = null;

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
    #back() {
        this.#back_function();
    }

    /**
     * @returns {void}
     */
    #continue() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#continue_function(
            {
                combination: this.#form_element.inputs.combination.value,
                subject: this.#form_element.inputs.subject.value
            }
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            "Intended Degree Program"
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            "Degree Program",
            [
                {
                    action: () => {
                        this.#back();
                    },
                    label: "Back"
                },
                {
                    action: () => {
                        this.#continue();
                    },
                    label: "Continue",
                    right: true
                }
            ]
        );

        const subject_element = this.#form_element.addInput(
            "Subject",
            "subject",
            "select"
        );
        subject_element.required = true;

        for (const subject of this.#intended_degree_program.subjects) {
            const option_element = document.createElement("option");
            option_element.text = subject.label;
            option_element.value = subject.id;
            subject_element.appendChild(option_element);
        }

        subject_element.addEventListener("input", () => {
            this.#renderCombinations();
        });

        const combination_element = this.#form_element.addInput(
            "Combination of Subjects",
            "combination",
            "select"
        );
        combination_element.required = true;

        combination_element.addEventListener("input", () => {
            this.#renderMandatory();
        });

        this.#mandatory_element = this.#form_element.addInput(
            "Mandatory Subjects",
            "mandatory",
            "readonly"
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));
    }

    /**
     * @returns {void}
     */
    #renderCombinations() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs.combination
        );

        this.#subject = this.#intended_degree_program.subjects.find(subject => subject.id === this.#form_element.inputs.subject.value) ?? null;

        this.#renderMandatory();

        if (this.#subject === null) {
            return;
        }

        for (const combination of this.#subject.combinations) {
            const option_element = document.createElement("option");
            option_element.text = combination.label;
            option_element.value = combination.id;
            this.#form_element.inputs.combination.appendChild(option_element);
        }
    }

    /**
     * @returns {void}
     */
    #renderMandatory() {
        this.#mandatory_element.innerText = this.#subject?.combinations?.find(combination => combination.id === this.#form_element.inputs.combination.value)?.mandatory ?? "";
    }
}

export const INTENDED_DEGREE_PROGRAM_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_INTENDED_DEGREE_PROGRAM}`;

customElements.define(INTENDED_DEGREE_PROGRAM_ELEMENT_TAG_NAME, IntendedDegreeProgramElement);
