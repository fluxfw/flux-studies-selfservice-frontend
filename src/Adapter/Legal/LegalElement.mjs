import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_LEGAL } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("./acceptedLegalFunction.mjs").acceptedLegalFunction} acceptedLegalFunction */
/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./Legal.mjs").Legal} Legal */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

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
    #disqualification_form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {Legal}
     */
    #legal;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @returns {LegalElement}
     */
    static new(css_api, label_service, localization_api, legal, accepted_legal_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            legal,
            accepted_legal_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, legal, accepted_legal_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#legal = legal;
        this.#accepted_legal_function = accepted_legal_function;
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
    async #acceptedLegal() {
        if (!this.#degree_program_form_element.validate() || !this.#disqualification_form_element.validate() || !this.#agb_form_element.validate() || !this.#complete_form_element.validate() || !this.#comments_form_element.validate()) {
            return;
        }

        const post_result = await this.#accepted_legal_function(
            {
                "not-disqualified": this.#disqualification_form_element.inputs["not-disqualified"].checked,
                agb: this.#agb_form_element.inputs.agb.checked,
                complete: this.#complete_form_element.inputs.complete.checked,
                comments: this.#comments_form_element.getTextareaValue(
                    "comments"
                )
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#comments_form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#comments_form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#comments_form_element.addInvalidMessage(
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
                "Legal"
            )
        ));

        this.#degree_program_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#degree_program_form_element.addTitle(
            this.#localization_api.translate(
                "Intended degree program"
            )
        );

        const degree_program_element = this.#degree_program_form_element.addInput(
            this.#localization_api.translate(
                "Degree program"
            ),
            "readonly"
        );
        degree_program_element.innerText = this.#label_service.getDegreeProgramLabel(
            this.#legal["degree-program"]
        );

        const subject_element = this.#degree_program_form_element.addInput(
            this.#localization_api.translate(
                "Subject"
            ),
            "readonly"
        );
        subject_element.innerText = this.#label_service.getSubjectLabel(
            this.#legal.subject
        );

        const combination_element = this.#degree_program_form_element.addInput(
            this.#localization_api.translate(
                "Combination of subjects"
            ),
            "readonly"
        );
        combination_element.innerText = this.#label_service.getCombinationLabel(
            this.#legal.combination
        );

        const mandatory_element = this.#degree_program_form_element.addInput(
            this.#localization_api.translate(
                "Mandatory subjects"
            ),
            "readonly"
        );
        mandatory_element.innerText = this.#label_service.getMultipleMandatoryLabel(
            this.#legal.combination
        );

        if (this.#legal.combination["single-choice"] !== null) {
            for (const single_choice of this.#legal.combination["single-choice"]) {
                const single_choice_element = this.#degree_program_form_element.addInput(
                    this.#localization_api.translate(
                        this.#label_service.getSingleChoiceLabel(
                            single_choice
                        )
                    ),
                    "readonly"
                );

                if (this.#legal["single-choice"] !== null) {
                    for (const choice of single_choice.choices) {
                        if (choice.id === this.#legal["single-choice"][single_choice.id]) {
                            single_choice_element.innerText = this.#label_service.getChoiceLabel(
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
                    this.#localization_api.translate(
                        this.#label_service.getMultipleChoiceLabel(
                            multiple_choice
                        )
                    ),
                    "readonly"
                );

                if (this.#legal["multiple-choice"] !== null) {
                    multiple_choice_element.innerText = this.#label_service.getChoicesLabel(
                        multiple_choice.choices.filter(choice => this.#legal["multiple-choice"][multiple_choice.id].includes(choice.id))
                    );
                }
            }
        }

        this.#shadow.appendChild(this.#degree_program_form_element);

        this.#disqualification_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#disqualification_form_element.addTitle(
            this.#localization_api.translate(
                "Disqualification"
            )
        );

        const not_disqualified_element = this.#disqualification_form_element.addInput(
            this.#localization_api.translate(
                "I am not disqualified from continuing my studies in the above-mentioned main subject because of exam failure or am not exams at another institution of higher education planned before the intended transfer, which would result in disqualification from the above-mentioned main subject in case of failure or non-attendance"
            ),
            "checkbox",
            "not-disqualified"
        );
        not_disqualified_element.required = true;

        this.#shadow.appendChild(this.#disqualification_form_element);

        this.#agb_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#agb_form_element.addTitle(
            this.#localization_api.translate(
                "AGB"
            )
        );

        const agb_element = this.#agb_form_element.addInput(
            this.#localization_api.translate(
                "I accept the terms and conditions of {agb}",
                null,
                {
                    agb: this.#legal.agb
                }
            ),
            "checkbox",
            "agb"
        );
        agb_element.required = true;

        this.#shadow.appendChild(this.#agb_form_element);

        this.#complete_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#complete_form_element.addTitle(
            this.#localization_api.translate(
                "Complete"
            )
        );

        const complete_element = this.#complete_form_element.addInput(
            this.#localization_api.translate(
                "I confirm that all provided data is complete and truthful. The application is legally binding"
            ),
            "checkbox",
            "complete"
        );
        complete_element.required = true;

        this.#shadow.appendChild(this.#complete_form_element);

        this.#comments_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#comments_form_element.addTitle(
            this.#localization_api.translate(
                "Comments"
            )
        );

        const comments_element = this.#comments_form_element.addInput(
            this.#localization_api.translate(
                "Did any problems during the application proccess occur or would you like to share any comments or suggestions with us, so please use the comment box below (max {max-comments-length} characters)",
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

        comments_element.addEventListener("input", () => {
            comments_left_element.innerText = this.#localization_api.translate(
                "Characters left: {characters}",
                null,
                {
                    characters: this.#legal["max-comments-length"] - comments_element.value.length
                }
            );
        });

        this.#comments_form_element.addButtons(
            () => {
                this.#acceptedLegal();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#comments_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
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

export const LEGAL_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_LEGAL}`;

customElements.define(LEGAL_ELEMENT_TAG_NAME, LegalElement);
