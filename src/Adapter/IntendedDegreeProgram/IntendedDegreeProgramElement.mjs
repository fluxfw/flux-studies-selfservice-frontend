import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_INTENDED_DEGREE_PROGRAM } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenIntendedDegreeProgramFunction.mjs").chosenIntendedDegreeProgramFunction} chosenIntendedDegreeProgramFunction */
/** @typedef {import("./IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class IntendedDegreeProgramElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenIntendedDegreeProgramFunction}
     */
    #chosen_intended_degree_program_function;
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
    #subject = null;

    /**
     * @param {CssApi} css_api
     * @param {IntendedDegreeProgram} intended_degree_program
     * @param {chosenIntendedDegreeProgramFunction} chosen_intended_degree_program_function
     * @param {backFunction | null} back_function
     * @returns {IntendedDegreeProgramElement}
     */
    static new(css_api, intended_degree_program, chosen_intended_degree_program_function, back_function = null) {
        return new this(
            css_api,
            intended_degree_program,
            chosen_intended_degree_program_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {IntendedDegreeProgram} intended_degree_program
     * @param {chosenIntendedDegreeProgramFunction} chosen_intended_degree_program_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, intended_degree_program, chosen_intended_degree_program_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#intended_degree_program = intended_degree_program;
        this.#chosen_intended_degree_program_function = chosen_intended_degree_program_function;
        this.#back_function = back_function;

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
    #chosenIntendedDegreeProgram() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#chosen_intended_degree_program_function(
            {
                subject: this.#form_element.inputs.subject.value,
                combination: this.#form_element.inputs.combination.value
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
            this.#css_api
        );

        this.#form_element.addTitle(
            "Degree Program"
        );

        const subject_element = this.#form_element.addInput(
            "Subject",
            "select",
            "subject"
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
            "select",
            "combination"
        );
        combination_element.required = true;

        combination_element.addEventListener("input", () => {
            this.#renderMandatory();
        });

        this.#mandatory_element = this.#form_element.addInput(
            "Mandatory Subjects",
            "readonly"
        );

        this.#form_element.addButtons(
            () => {
                this.#chosenIntendedDegreeProgram();
            },
            this.#back_function,
            "Please save your selection, in case you need to choose additional mandatory subjects for your course, they will be shown on the next page."
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));

        if (this.#intended_degree_program.values !== null) {
            subject_element.value = this.#intended_degree_program.values.subject;
            subject_element.dispatchEvent(new Event("input"));

            combination_element.value = this.#intended_degree_program.values.combination;
            combination_element.dispatchEvent(new Event("input"));
        }
    }

    /**
     * @returns {void}
     */
    #renderCombinations() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs.combination
        );

        this.#subject = this.#intended_degree_program.subjects.find(subject => subject.id === this.#form_element.inputs.subject.value) ?? null;

        this.#form_element.inputs.combination.dispatchEvent(new Event("input"));

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

export const INTENDED_DEGREE_PROGRAM_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_INTENDED_DEGREE_PROGRAM}`;

customElements.define(INTENDED_DEGREE_PROGRAM_ELEMENT_TAG_NAME, IntendedDegreeProgramElement);
