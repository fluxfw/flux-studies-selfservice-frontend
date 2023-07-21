import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_LEGAL } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { LOCALIZATION_KEY_AGB, LOCALIZATION_KEY_CHARACTERS_LEFT_CHARACTERS, LOCALIZATION_KEY_CHOICE_OF_SUBJECT, LOCALIZATION_KEY_COMBINATION_OF_SUBJECTS, LOCALIZATION_KEY_COMMENTS, LOCALIZATION_KEY_COMPLETE, LOCALIZATION_KEY_DID_ANY_PROBLEMS_DURING_THE_APPLICATION_PROCCESS_OCCUR_OR_WOULD_YOU_LIKE_TO_SHARE_ANY_COMMENTS_OR_SUGGESTIONS_WITH_US_SO_PLEASE_USE_THE_COMMENT_BOX_BELOW_MAX_MAX_COMMENTS_LENGTH_CHARACTERS, LOCALIZATION_KEY_DISQUALIFICATION, LOCALIZATION_KEY_I_ACCEPT_THE_TERMS_AND_CONDITIONS_OF, LOCALIZATION_KEY_I_AM_NOT_DISQUALIFIED_FROM_CONTINUING_MY_STUDIES_IN_THE_ABOVE_MENTIONED_MAIN_SUBJECT_BECAUSE_OF_EXAM_FAILURE_OR_AM_NOT_EXAMS_AT_ANOTHER_INSTITUTION_OF_HIGHER_EDUCATION_PLANNED_BEFORE_THE_INTENDED_TRANSFER_WHICH_WOULD_RESULT_IN_DISQUALIFICATION_FROM_THE_ABOVE_MENTIONED_MAIN_SUBJECT_IN_CASE_OF_FAILURE_OR_NON_ATTENDANCE, LOCALIZATION_KEY_I_CONFIRM_THAT_ALL_PROVIDED_DATA_IS_COMPLETE_AND_TRUTHFUL_THE_APPLICATION_IS_LEGALLY_BINDING, LOCALIZATION_KEY_INTENDED_DEGREE_PROGRAM, LOCALIZATION_KEY_LEGAL, LOCALIZATION_KEY_MANDATORY_SUBJECTS, LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA, LOCALIZATION_KEY_SUBJECT } from "../Localization/LOCALIZATION_KEY.mjs";

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

        this.#shadow.adoptedStyleSheets.push(css);

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
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA
                )
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.append(TitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_LEGAL
            )
        ));

        this.#degree_program_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#degree_program_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INTENDED_DEGREE_PROGRAM
            )
        );

        const degree_program_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_CHOICE_OF_SUBJECT
            ),
            "readonly"
        );
        degree_program_element.innerText = await this.#label_service.getDegreeProgramLabel(
            this.#legal["degree-program"]
        );

        const subject_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SUBJECT
            ),
            "readonly"
        );
        subject_element.innerText = await this.#label_service.getSubjectLabel(
            this.#legal.subject
        );

        const combination_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_COMBINATION_OF_SUBJECTS
            ),
            "readonly"
        );
        combination_element.innerText = await this.#label_service.getCombinationLabel(
            this.#legal.combination
        );

        const mandatory_element = this.#degree_program_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_MANDATORY_SUBJECTS
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

        this.#shadow.append(this.#degree_program_form_element);

        this.#disqualification_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#disqualification_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_DISQUALIFICATION
            )
        );

        const not_disqualified_element = this.#disqualification_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_I_AM_NOT_DISQUALIFIED_FROM_CONTINUING_MY_STUDIES_IN_THE_ABOVE_MENTIONED_MAIN_SUBJECT_BECAUSE_OF_EXAM_FAILURE_OR_AM_NOT_EXAMS_AT_ANOTHER_INSTITUTION_OF_HIGHER_EDUCATION_PLANNED_BEFORE_THE_INTENDED_TRANSFER_WHICH_WOULD_RESULT_IN_DISQUALIFICATION_FROM_THE_ABOVE_MENTIONED_MAIN_SUBJECT_IN_CASE_OF_FAILURE_OR_NON_ATTENDANCE
            ),
            "checkbox",
            "not-disqualified"
        );
        not_disqualified_element.required = true;

        this.#shadow.append(this.#disqualification_form_element);

        this.#agb_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#agb_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_AGB
            )
        );

        const agb_element = this.#agb_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_I_ACCEPT_THE_TERMS_AND_CONDITIONS_OF
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
        agb_element.nextElementSibling.append(agb_link_element);

        this.#shadow.append(this.#agb_form_element);

        this.#complete_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#complete_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_COMPLETE
            )
        );

        const complete_element = this.#complete_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_I_CONFIRM_THAT_ALL_PROVIDED_DATA_IS_COMPLETE_AND_TRUTHFUL_THE_APPLICATION_IS_LEGALLY_BINDING
            ),
            "checkbox",
            "complete"
        );
        complete_element.required = true;

        this.#shadow.append(this.#complete_form_element);

        this.#comments_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#comments_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_COMMENTS
            )
        );

        const comments_element = this.#comments_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_DID_ANY_PROBLEMS_DURING_THE_APPLICATION_PROCCESS_OCCUR_OR_WOULD_YOU_LIKE_TO_SHARE_ANY_COMMENTS_OR_SUGGESTIONS_WITH_US_SO_PLEASE_USE_THE_COMMENT_BOX_BELOW_MAX_MAX_COMMENTS_LENGTH_CHARACTERS,
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
        comments_element.parentElement.after(comments_left_element);

        comments_element.addEventListener("input", async () => {
            comments_left_element.innerText = await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_CHARACTERS_LEFT_CHARACTERS,
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

        this.#shadow.append(this.#comments_form_element);

        this.#shadow.append(MandatoryElement.new(
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
