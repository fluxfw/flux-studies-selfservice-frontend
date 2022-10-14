import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_INTENDED_DEGREE_PROGRAM_2 } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenIntendedDegreeProgram2Function.mjs").chosenIntendedDegreeProgram2Function} chosenIntendedDegreeProgram2Function */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

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
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @returns {IntendedDegreeProgram2Element}
     */
    static new(css_api, label_service, localization_api, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            intended_degree_program_2,
            chosen_intended_degree_program_2_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
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
     * @returns {Promise<void>}
     */
    async #chosenIntendedDegreeProgram2() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_intended_degree_program_2_function(
            {
                "single-choice": this.#intended_degree_program_2.combination["single-choice"] !== null ? Object.fromEntries(Object.entries(this.#form_element.getStartsWithInputs(
                    "single-choice_"
                )).map(([
                    id,
                    input_element
                ]) => [
                        id,
                        input_element.value
                    ])) : null,
                "multiple-choice": this.#intended_degree_program_2.combination["multiple-choice"] !== null ? Object.fromEntries(Object.entries(this.#form_element.getStartsWithInputs(
                    "multiple-choice_"
                )).map(([
                    id,
                    input_element
                ]) => [
                        id,
                        [
                            ...input_element.selectedOptions
                        ].map(option_element => option_element.value)
                    ])) : null,
                "further-information": this.#form_element.inputs["further-information"].value.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#form_element.addInvalidMessage(
            this.#localization_api.translate(
                "Please check your data!"
            )
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Intended Degree Program"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            () => {
                if (this.#intended_degree_program_2.combination["multiple-choice"] === null) {
                    return true;
                }

                for (const multiple_choice of this.#intended_degree_program_2.combination["multiple-choice"]) {
                    const input_element = this.#form_element.inputs[`multiple-choice_${multiple_choice.id}`];

                    const values = [
                        ...input_element.selectedOptions
                    ].map(option_element => option_element.value);

                    let ect = 0;
                    for (const choice of multiple_choice.choices) {
                        if (values.includes(choice.id)) {
                            ect += choice.ect;
                        }
                    }

                    if (ect < multiple_choice.ect) {
                        this.#form_element.setCustomValidationMessage(
                            input_element,
                            this.#localization_api.translate(
                                "Please select more {ect}!",
                                null,
                                {
                                    ect: this.#label_service.getEctLabel(
                                        multiple_choice.ect - ect
                                    )
                                }
                            )
                        );
                        return false;
                    }

                    if (ect > multiple_choice.ect) {
                        this.#form_element.setCustomValidationMessage(
                            input_element,
                            this.#localization_api.translate(
                                "Please select less {ect}!",
                                null,
                                {
                                    ect: this.#label_service.getEctLabel(
                                        ect - multiple_choice.ect
                                    )
                                }
                            )
                        );
                        return false;
                    }
                }

                return true;
            }
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Choice of Subjects"
            )
        );

        const subject_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Subject"
            ),
            "readonly"
        );
        subject_element.innerText = this.#label_service.getSubjectLabel(
            this.#intended_degree_program_2.subject
        );

        const combination_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Combination of Subjects"
            ),
            "readonly"
        );
        combination_element.innerText = this.#label_service.getCombinationLabel(
            this.#intended_degree_program_2.combination
        );

        const mandatory_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Mandatory Subjects"
            ),
            "readonly"
        );
        mandatory_element.innerText = this.#label_service.getMultipleMandatoryLabel(
            this.#intended_degree_program_2.combination
        );

        if (this.#intended_degree_program_2.combination["single-choice"] !== null || this.#intended_degree_program_2.combination["multiple-choice"] !== null) {
            this.#form_element.addSubtitle(
                this.#localization_api.translate(
                    "Please choose your combination of subjects from the given selection below"
                )
            );

            if (this.#intended_degree_program_2.combination["single-choice"] !== null) {
                for (const single_choice of this.#intended_degree_program_2.combination["single-choice"]) {
                    const single_choice_element = this.#form_element.addInput(
                        this.#label_service.getSingleChoiceLabel(
                            single_choice
                        ),
                        "select",
                        `single-choice_${single_choice.id}`,
                        true
                    );
                    single_choice_element.required = true;

                    for (const choice of single_choice.choices) {
                        const option_element = document.createElement("option");
                        option_element.text = this.#label_service.getChoiceLabel(
                            choice
                        );
                        option_element.value = choice.id;
                        single_choice_element.appendChild(option_element);
                    }
                }
            }

            if (this.#intended_degree_program_2.combination["multiple-choice"] !== null) {
                for (const multiple_choice of this.#intended_degree_program_2.combination["multiple-choice"]) {
                    const multiple_choice_element = this.#form_element.addInput(
                        this.#label_service.getMultipleChoiceLabel(
                            multiple_choice
                        ),
                        "select",
                        `multiple-choice_${multiple_choice.id}`,
                        true
                    );
                    multiple_choice_element.innerHTML = "";
                    multiple_choice_element.multiple = true;
                    multiple_choice_element.required = true;
                    multiple_choice_element.size = multiple_choice.choices.length;

                    for (const choice of multiple_choice.choices) {
                        const option_element = document.createElement("option");
                        option_element.text = this.#label_service.getChoiceLabel(
                            choice
                        );
                        option_element.value = choice.id;
                        multiple_choice_element.appendChild(option_element);
                    }
                }

                this.#form_element.addSubtitle(
                    this.#localization_api.translate(
                        "On desktop operating systems/browsers may use {ctrl} + {click} for select multiple options",
                        null,
                        {
                            click: this.#localization_api.translate(
                                "Click"
                            ),
                            ctrl: this.#localization_api.translate(
                                "Ctrl"
                            )
                        }
                    )
                );
            }
        }

        const further_information_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "If you have already studied the choosen subject and would like to continue in an advanced semester, please enter it here"
            ),
            "textarea",
            "further-information",
            true
        );

        this.#form_element.addButtons(
            () => {
                this.#chosenIntendedDegreeProgram2();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
        ));

        if (this.#intended_degree_program_2.values !== null) {
            if (this.#intended_degree_program_2.values["single-choice"] !== null) {
                for (const [
                    id,
                    input_element
                ] of Object.entries(this.#form_element.getStartsWithInputs(
                    "single-choice_"
                ))) {
                    if (id in this.#intended_degree_program_2.values["single-choice"]) {
                        input_element.value = this.#intended_degree_program_2.values["single-choice"][id];
                    }
                }
            }

            if (this.#intended_degree_program_2.values["multiple-choice"] !== null) {
                for (const [
                    id,
                    input_element
                ] of Object.entries(this.#form_element.getStartsWithInputs(
                    "multiple-choice_"
                ))) {
                    if (id in this.#intended_degree_program_2.values["multiple-choice"]) {
                        for (const option_element of input_element.options) {
                            if (this.#intended_degree_program_2.values["multiple-choice"][id].includes(option_element.value)) {
                                option_element.selected = true;
                            }
                        }
                    }
                }
            }

            further_information_element.value = this.#intended_degree_program_2.values["further-information"];
        }
    }
}

export const INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_INTENDED_DEGREE_PROGRAM_2}`;

customElements.define(INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME, IntendedDegreeProgram2Element);
