import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_INTENDED_DEGREE_PROGRAM_2 } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenIntendedDegreeProgram2Function.mjs").chosenIntendedDegreeProgram2Function} chosenIntendedDegreeProgram2Function */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class IntendedDegreeProgram2Element extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenIntendedDegreeProgram2Function}
     */
    #chosen_intended_degree_program_2_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {IntendedDegreeProgram2}
     */
    #intended_degree_program_2;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @returns {IntendedDegreeProgram2Element}
     */
    static new(css_api, label_service, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            intended_degree_program_2,
            chosen_intended_degree_program_2_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#intended_degree_program_2 = intended_degree_program_2;
        this.#chosen_intended_degree_program_2_function = chosen_intended_degree_program_2_function;
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
    #chosenIntendedDegreeProgram2() {
        if (!this.#form_element.validate()) {
            return;
        }

        this.#chosen_intended_degree_program_2_function(
            {
                "further-information": this.#form_element.inputs["further-information"].value.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
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
            "Choice of Subjects"
        );

        const subject_element = this.#form_element.addInput(
            "Subject",
            "readonly"
        );
        subject_element.innerText = this.#label_service.getSubjectLabel(
            this.#intended_degree_program_2.subject
        );

        const combination_element = this.#form_element.addInput(
            "Combination of Subjects",
            "readonly"
        );
        combination_element.innerText = this.#label_service.getCombinationLabel(
            this.#intended_degree_program_2.combination
        );

        const mandatory_element = this.#form_element.addInput(
            "Mandatory Subjects",
            "readonly"
        );
        mandatory_element.innerText = this.#label_service.getMultipleMandatoryLabel(
            this.#intended_degree_program_2.combination
        );

        this.#form_element.addSubtitle(
            "If you have already studied the choosen subject and would like to continue in an advanced semester, please enter it here:"
        );

        const further_information_element = this.#form_element.addTextarea(
            "further-information"
        );

        this.#form_element.addButtons(
            () => {
                this.#chosenIntendedDegreeProgram2();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        if (this.#intended_degree_program_2.values !== null) {
            further_information_element.value = this.#intended_degree_program_2.values["further-information"];
        }
    }
}

export const INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_INTENDED_DEGREE_PROGRAM_2}`;

customElements.define(INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME, IntendedDegreeProgram2Element);
