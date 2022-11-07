import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PREVIOUS_STUDIES } from "../Page/PAGE.mjs";
import { PreviousStudyElement } from "./PreviousStudyElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenPreviousStudiesFunction.mjs").chosenPreviousStudiesFunction} chosenPreviousStudiesFunction */
/** @typedef {import("./ChosenPreviousStudy.mjs").ChosenPreviousStudy} ChosenPreviousStudy */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./PreviousStudies.mjs").PreviousStudies} PreviousStudies */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PreviousStudiesElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenPreviousStudiesFunction}
     */
    #chosen_previous_studies_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {PreviousStudies}
     */
    #previous_studies;
    /**
     * @type {PreviousStudyElement[]}
     */
    #previous_study_elements;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @returns {PreviousStudiesElement}
     */
    static new(css_api, label_service, localization_api, previous_studies, chosen_previous_studies, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            previous_studies,
            chosen_previous_studies,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, previous_studies, chosen_previous_studies, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#previous_studies = previous_studies;
        this.#chosen_previous_studies_function = chosen_previous_studies;
        this.#back_function = back_function;
        this.#previous_study_elements = [];

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {ChosenPreviousStudy | null} values
     * @returns {PreviousStudyElement}
     */
    #addPreviousStudy(values = null) {
        const previous_study_element = PreviousStudyElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            this.#previous_studies,
            () => {
                this.#removePreviousStudy(
                    previous_study_element
                );
            },
            values
        );

        this.#previous_study_elements.push(previous_study_element);

        this.#form_element.insertAdjacentElement("beforebegin", previous_study_element);

        return previous_study_element;
    }

    /**
     * @returns {Promise<void>}
     */
    async #chosenPreviousStudies() {
        if (!this.#previous_study_elements.every(previous_study_element => previous_study_element.validate()) || !this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_previous_studies_function(
            {
                "previous-studies": this.#previous_study_elements.map(previous_study_element => previous_study_element.getValues())
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
                this.#localization_api.translate(
                    "Please check your data!"
                )
            );
        }
    }

    /**
     * @returns {void}
     */
    #ensureAtLeastOnePreviousStudy() {
        if (this.#previous_study_elements.length === 0) {
            this.#addPreviousStudy();
        }
    }

    /**
     * @param {PreviousStudyElement} previous_study_element
     * @returns {void}
     */
    #removePreviousStudy(previous_study_element) {
        previous_study_element.remove();

        this.#previous_study_elements.splice(this.#previous_study_elements.indexOf(previous_study_element), 1);

        this.#ensureAtLeastOnePreviousStudy();
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Your previous studies"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        const subtitle_element = this.#form_element.addSubtitle(
            this.#localization_api.translate(
                "Please indicate all your university studies even if you did not complete them"
            )
        );

        const add_previous_study_element = FormButtonElement.new(
            this.#css_api,
            "+"
        );
        add_previous_study_element.button.addEventListener("click", () => {
            this.#addPreviousStudy();
        });
        subtitle_element.insertAdjacentElement("beforebegin", add_previous_study_element);

        this.#form_element.addButtons(
            () => {
                this.#chosenPreviousStudies();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
        ));

        if (this.#previous_studies.values !== null) {
            for (const previous_study of this.#previous_studies.values["previous-studies"]) {
                this.#addPreviousStudy(
                    previous_study
                );
            }
        }

        this.#ensureAtLeastOnePreviousStudy();
    }
}

export const PREVIOUS_STUDIES_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_PREVIOUS_STUDIES}`;

customElements.define(PREVIOUS_STUDIES_ELEMENT_TAG_NAME, PreviousStudiesElement);
