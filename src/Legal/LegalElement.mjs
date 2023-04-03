import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_LEGAL } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("./acceptedLegalFunction.mjs").acceptedLegalFunction} acceptedLegalFunction */
/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./Legal.mjs").Legal} Legal */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/LegalElement.css`
);

export class LegalElement extends HTMLElement {
    /**
     * @type {acceptedLegalFunction}
     */
    #accepted_legal_function;
    /**
     * @type {FormElement}
     */
    #agb_form_element;
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {FormElement}
     */
    #comments_form_element;
    /**
     * @type {FormElement}
     */
    #complete_form_element;
    /**
     * @type {FormElement}
     */
    #degree_program_form_element;
    /**
     * @type {FormElement}
     */
    #disqualification_form_element;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {Legal}
     */
    #legal;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @returns {LegalElement}
     */
    static new(flux_localization_api, label_service, legal, accepted_legal_function, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            legal,
            accepted_legal_function,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, legal, accepted_legal_function, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#legal = legal;
        this.#accepted_legal_function = accepted_legal_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #acceptedLegal() {
        if (!await this.#degree_program_form_element.validate() || !await this.#disqualification_form_element.validate() || !await this.#agb_form_element.validate() || !await this.#complete_form_element.validate() || !await this.#comments_form_element.validate()) {
            return;
        }

        const post_result = await this.#accepted_legal_function(
            {
                "not-disqualified": this.#disqualification_form_element.inputs["not-disqualified"].checked,
                agb: this.#agb_form_element.inputs.agb.checked,
                complete: this.#complete_form_element.inputs.complete.checked,
                comments: this.#comments_form_element.inputs.comments.value
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                this.#comments_form_element.addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                );
            }
        } else {
            this.#comments_form_element.addInvalidMessage(
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
                "Legal"
            )
        ));

        this.#degree_program_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#degree_program_form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Intended degree program"
            )
        );

        const degree_program_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                "Choice of subject"
            ),
            "readonly"
        );
        degree_program_element.innerText = await this.#label_service.getDegreeProgramLabel(
            this.#legal["degree-program"]
        );

        const subject_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                "Subject"
            ),
            "readonly"
        );
        subject_element.innerText = await this.#label_service.getSubjectLabel(
            this.#legal.subject
        );

        const combination_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                "Combination of subjects"
            ),
            "readonly"
        );
        combination_element.innerText = await this.#label_service.getCombinationLabel(
            this.#legal.combination
        );

        const mandatory_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                "Mandatory subjects"
            ),
            "readonly"
        );
        mandatory_element.innerText = await this.#label_service.getMultipleMandatoryLabel(
            this.#legal.combination
        );

        if (this.#legal.combination["single-choice"] !== null) {
            for (const single_choice of this.#legal.combination["single-choice"]) {
                const single_choice_element = this.#degree_program_form_element.addInput(
                    await this.#label_service.getSingleChoiceLabel(
                        single_choice
                    ),
                    "readonly"
                );

                if (this.#legal["single-choice"] !== null) {
                    for (const choice of single_choice.choices) {
                        if (choice.id === this.#legal["single-choice"][single_choice.id]) {
                            single_choice_element.innerText = await this.#label_service.getChoiceLabel(
                                choice
                            );
                            break;
                        }
                    }
                }
            }
        }

        if (this.#legal.combination["multiple-choice"] !== null) {
            for (const multiple_choice of this.#legal.combination["multiple-choice"]) {
                const multiple_choice_element = this.#degree_program_form_element.addInput(
                    await this.#label_service.getMultipleChoiceLabel(
                        multiple_choice
                    ),
                    "readonly"
                );

                if (this.#legal["multiple-choice"] !== null) {
                    multiple_choice_element.innerText = await this.#label_service.getChoicesLabel(
                        multiple_choice.choices.filter(choice => this.#legal["multiple-choice"][multiple_choice.id].includes(choice.id))
                    );
                }
            }
        }

        this.#shadow.appendChild(this.#degree_program_form_element);

        this.#disqualification_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#disqualification_form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Disqualification"
            )
        );

        const not_disqualified_element = this.#disqualification_form_element.addInput(
            await this.#flux_localization_api.translate(
                "I am not disqualified from continuing my studies in the above-mentioned main subject because of exam failure or am not exams at another institution of higher education planned before the intended transfer, which would result in disqualification from the above-mentioned main subject in case of failure or non-attendance"
            ),
            "checkbox",
            "not-disqualified"
        );
        not_disqualified_element.required = true;

        this.#shadow.appendChild(this.#disqualification_form_element);

        this.#agb_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#agb_form_element.addTitle(
            await this.#flux_localization_api.translate(
                "AGB"
            )
        );

        const agb_element = this.#agb_form_element.addInput(
            await this.#flux_localization_api.translate(
                "I accept the terms and conditions of"
            ),
            "checkbox",
            "agb"
        );
        agb_element.required = true;

        const agb_link_element = document.createElement("a");
        const link = await this.#label_service.getAgbLink(
            this.#legal
        );
        if (link !== "") {
            agb_link_element.href = link;
        }
        agb_link_element.innerText = await this.#label_service.getAgbLabel(
            this.#legal
        );
        agb_link_element.rel = "noopener noreferrer";
        agb_link_element.target = "__blank";
        agb_element.nextElementSibling.append(" ");
        agb_element.nextElementSibling.appendChild(agb_link_element);

        this.#shadow.appendChild(this.#agb_form_element);

        this.#complete_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#complete_form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Complete"
            )
        );

        const complete_element = this.#complete_form_element.addInput(
            await this.#flux_localization_api.translate(
                "I confirm that all provided data is complete and truthful. The application is legally binding"
            ),
            "checkbox",
            "complete"
        );
        complete_element.required = true;

        this.#shadow.appendChild(this.#complete_form_element);

        this.#comments_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#comments_form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Comments"
            )
        );

        const comments_element = this.#comments_form_element.addInput(
            await this.#flux_localization_api.translate(
                "Did any problems during the application proccess occur or would you like to share any comments or suggestions with us, so please use the comment box below (Max {max-comments-length} characters)",
                null,
                {
                    "max-comments-length": this.#legal["max-comments-length"]
                }
            ),
            "textarea",
            "comments",
            true
        );
        comments_element.maxLength = this.#legal["max-comments-length"];

        const comments_left_element = document.createElement("div");
        comments_element.parentElement.insertAdjacentElement("afterend", comments_left_element);

        comments_element.addEventListener("input", async () => {
            comments_left_element.innerText = await this.#flux_localization_api.translate(
                "Characters left: {characters}",
                null,
                {
                    characters: this.#legal["max-comments-length"] - comments_element.value.length
                }
            );
        });

        await this.#comments_form_element.addButtons(
            () => {
                this.#acceptedLegal();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#comments_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#flux_localization_api
        ));

        if (this.#legal.values !== null) {
            not_disqualified_element.checked = this.#legal.values["not-disqualified"];

            agb_element.checked = this.#legal.values.agb;

            complete_element.checked = this.#legal.values.complete;

            comments_element.value = this.#legal.values.comments;
        }

        comments_element.dispatchEvent(new Event("input"));
    }
}

export const LEGAL_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_LEGAL}`;

customElements.define(LEGAL_ELEMENT_TAG_NAME, LegalElement);
