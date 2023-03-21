import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_INTENDED_DEGREE_PROGRAM_2 } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenIntendedDegreeProgram2Function.mjs").chosenIntendedDegreeProgram2Function} chosenIntendedDegreeProgram2Function */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/IntendedDegreeProgram2Element.css`
);

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
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
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
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @returns {IntendedDegreeProgram2Element}
     */
    static new(flux_localization_api, label_service, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            intended_degree_program_2,
            chosen_intended_degree_program_2_function,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {chosenIntendedDegreeProgram2Function} chosen_intended_degree_program_2_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, intended_degree_program_2, chosen_intended_degree_program_2_function, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#intended_degree_program_2 = intended_degree_program_2;
        this.#chosen_intended_degree_program_2_function = chosen_intended_degree_program_2_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #chosenIntendedDegreeProgram2() {
        if (!await this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_intended_degree_program_2_function(
            {
                "single-choice": this.#intended_degree_program_2.combination["single-choice"] !== null ? Object.fromEntries(Object.entries(this.#form_element.getInputsByNameStartsWith(
                    "single-choice-"
                )).map(([
                    id,
                    input_element
                ]) => [
                        id,
                        input_element.value
                    ])) : null,
                "multiple-choice": this.#intended_degree_program_2.combination["multiple-choice"] !== null ? Object.fromEntries(Object.entries(this.#form_element.getInputsByNameStartsWith(
                    "multiple-choice-"
                )).map(([
                    id,
                    input_element
                ]) => [
                        id,
                        Array.from(input_element.selectedOptions).map(option_element => option_element.value)
                    ])) : null,
                "further-information": this.#form_element.getTextareaValue(
                    "further-information"
                )
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                this.#form_element.addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                );
            }
        } else {
            this.#form_element.addInvalidMessage(
                await this.#flux_localization_api.translate(
                    "Please check your data!"
                )
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.appendChild(TitleElement.new(
            await this.#flux_localization_api.translate(
                "Intended degree program"
            )
        ));

        this.#form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                if (this.#intended_degree_program_2.combination["multiple-choice"] === null) {
                    return true;
                }

                for (const multiple_choice of this.#intended_degree_program_2.combination["multiple-choice"]) {
                    const input_element = this.#form_element.inputs[`multiple-choice-${multiple_choice.id}`];

                    const values = Array.from(input_element.selectedOptions).map(option_element => option_element.value);

                    let ect = 0;
                    for (const choice of multiple_choice.choices) {
                        if (values.includes(choice.id)) {
                            ect += choice.ect;
                        }
                    }

                    if (ect < multiple_choice.ect) {
                        this.#form_element.setCustomValidationMessage(
                            input_element,
                            await this.#flux_localization_api.translate(
                                "Please select more {ect}!",
                                null,
                                {
                                    ect: await this.#label_service.getEctLabel(
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
                            await this.#flux_localization_api.translate(
                                "Please select less {ect}!",
                                null,
                                {
                                    ect: await this.#label_service.getEctLabel(
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
            await this.#flux_localization_api.translate(
                "Choice of subjects"
            )
        );

        const subject_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Subject"
            ),
            "readonly"
        );
        subject_element.innerText = await this.#label_service.getSubjectLabel(
            this.#intended_degree_program_2.subject
        );

        const combination_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Combination of subjects"
            ),
            "readonly"
        );
        combination_element.innerText = await this.#label_service.getCombinationLabel(
            this.#intended_degree_program_2.combination
        );

        const mandatory_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Mandatory subjects"
            ),
            "readonly"
        );
        mandatory_element.innerText = await this.#label_service.getMultipleMandatoryLabel(
            this.#intended_degree_program_2.combination
        );

        if (this.#intended_degree_program_2.combination["single-choice"] !== null || this.#intended_degree_program_2.combination["multiple-choice"] !== null) {
            this.#form_element.addSubtitle(
                await this.#flux_localization_api.translate(
                    "Please choose your combination of subjects from the given selection below"
                )
            );

            if (this.#intended_degree_program_2.combination["single-choice"] !== null) {
                for (const single_choice of this.#intended_degree_program_2.combination["single-choice"]) {
                    const single_choice_element = this.#form_element.addInput(
                        await this.#label_service.getSingleChoiceLabel(
                            single_choice
                        ),
                        "select",
                        `single-choice-${single_choice.id}`,
                        true
                    );
                    single_choice_element.required = true;

                    for (const choice of single_choice.choices) {
                        const option_element = document.createElement("option");
                        option_element.text = await this.#label_service.getChoiceLabel(
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
                        await this.#label_service.getMultipleChoiceLabel(
                            multiple_choice
                        ),
                        "select",
                        `multiple-choice-${multiple_choice.id}`,
                        true
                    );
                    multiple_choice_element.innerHTML = "";
                    multiple_choice_element.multiple = true;
                    multiple_choice_element.required = true;
                    multiple_choice_element.size = multiple_choice.choices.length;

                    for (const choice of multiple_choice.choices) {
                        const option_element = document.createElement("option");
                        option_element.text = await this.#label_service.getChoiceLabel(
                            choice
                        );
                        option_element.value = choice.id;
                        multiple_choice_element.appendChild(option_element);
                    }
                }

                this.#form_element.addSubtitle(
                    await this.#flux_localization_api.translate(
                        "On desktop operating systems/browsers may use Ctrl + Click for select multiple options"
                    )
                );
            }
        }

        const further_information_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "If you have already studied the choosen subject and would like to continue in an advanced semester, please enter it here"
            ),
            "textarea",
            "further-information",
            true
        );

        await this.#form_element.addButtons(
            () => {
                this.#chosenIntendedDegreeProgram2();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#flux_localization_api
        ));

        if (this.#intended_degree_program_2.values !== null) {
            if (this.#intended_degree_program_2.values["single-choice"] !== null) {
                for (const [
                    id,
                    input_element
                ] of Object.entries(this.#form_element.getInputsByNameStartsWith(
                    "single-choice-"
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
                ] of Object.entries(this.#form_element.getInputsByNameStartsWith(
                    "multiple-choice-"
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

export const INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_INTENDED_DEGREE_PROGRAM_2}`;

customElements.define(INTENDED_DEGREE_PROGRAM_2_ELEMENT_TAG_NAME, IntendedDegreeProgram2Element);
