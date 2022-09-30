import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_CHOICE_SUBJECT } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("./chosenSubjectFunction.mjs").chosenSubjectFunction} chosenSubjectFunction */
/** @typedef {import("../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ChoiceSubjectElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {ChoiceSubject}
     */
    #choice_subject;
    /**
     * @type {chosenSubjectFunction}
     */
    #chosen_subject_function;
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
     * @param {CssApi} css_api
     * @param {ChoiceSubject} choice_subject
     * @param {chosenSubjectFunction} chosen_subject_function
     * @param {backFunction | null} back_function
     * @returns {ChoiceSubjectElement}
     */
    static new(css_api, choice_subject, chosen_subject_function, back_function = null) {
        return new this(
            css_api,
            choice_subject,
            chosen_subject_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {ChoiceSubject} choice_subject
     * @param {chosenSubjectFunction} chosen_subject_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, choice_subject, chosen_subject_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#choice_subject = choice_subject;
        this.#chosen_subject_function = chosen_subject_function;
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
    #chosenSubject() {
        if (!this.#degree_program_form_element.validate() || !this.#qualifications_form_element.validate()) {
            return;
        }

        this.#chosen_subject_function(
            {
                "degree-program": this.#degree_program_form_element.inputs["degree-program"].value,
                qualifications: Object.fromEntries(this.#qualifications_form_element.getGroupedInputs(
                    "qualification"
                ).map(input_element => [
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
            this.#css_api
        );

        this.#degree_program_form_element.addTitle(
            "Choose your degree program"
        );

        for (const degree_program of this.#choice_subject["degree-programs"]) {
            const input_element = this.#degree_program_form_element.addInput(
                degree_program.label,
                "radio",
                "degree-program"
            );
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
            this.#css_api
        );

        this.#qualifications_form_element.addTitle(
            "Qualifications for admission"
        );

        this.#qualifications_form_element.addButtons(
            () => {
                this.#chosenSubject();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#qualifications_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));

        if (this.#choice_subject.values !== null) {
            for (const input_element of this.#degree_program_form_element.inputs["degree-program"]) {
                if (input_element.value === this.#choice_subject.values["degree-program"]) {
                    input_element.checked = true;
                    input_element.dispatchEvent(new Event("input"));
                    break;
                }
            }

            for (const input_element of this.#qualifications_form_element.getGroupedInputs(
                "qualification"
            )) {
                if (input_element.value in this.#choice_subject.values.qualifications) {
                    input_element.checked = this.#choice_subject.values.qualifications[input_element.value];
                }
            }
        }
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {void}
     */
    #renderQualifications(degree_program) {
        this.#qualifications_form_element.clearInputs();

        for (const qualification of degree_program.qualifications) {
            const input_element = this.#qualifications_form_element.addInput(
                qualification.label,
                "checkbox",
                "qualification"
            );
            input_element.required = qualification.required ?? false;
            input_element.value = qualification.id;
        }
    }
}

export const CHOICE_SUBJECT_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_CHOICE_SUBJECT}`;

customElements.define(CHOICE_SUBJECT_ELEMENT_TAG_NAME, ChoiceSubjectElement);
