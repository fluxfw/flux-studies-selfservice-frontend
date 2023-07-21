import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PREVIOUS_STUDIES } from "../Page/PAGE.mjs";
import { PreviousStudyElement } from "./PreviousStudyElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA, LOCALIZATION_KEY_PLEASE_INDICATE_ALL_YOUR_UNIVERSITY_STUDIES_EVEN_IF_YOU_DID_NOT_COMPLETE_THEM, LOCALIZATION_KEY_YOUR_PREVIOUS_STUDIES } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenPreviousStudiesFunction.mjs").chosenPreviousStudiesFunction} chosenPreviousStudiesFunction */
/** @typedef {import("./ChosenPreviousStudy.mjs").ChosenPreviousStudy} ChosenPreviousStudy */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./PreviousStudies.mjs").PreviousStudies} PreviousStudies */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PreviousStudiesElement.css`
);

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
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
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
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @returns {PreviousStudiesElement}
     */
    static new(flux_localization_api, label_service, previous_studies, chosen_previous_studies, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            previous_studies,
            chosen_previous_studies,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, previous_studies, chosen_previous_studies, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#previous_studies = previous_studies;
        this.#chosen_previous_studies_function = chosen_previous_studies;
        this.#back_function = back_function;
        this.#previous_study_elements = [];

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @param {ChosenPreviousStudy | null} values
     * @returns {PreviousStudyElement}
     */
    #addPreviousStudy(values = null) {
        const previous_study_element = PreviousStudyElement.new(
            this.#flux_localization_api,
            this.#label_service,
            this.#previous_studies,
            () => {
                this.#removePreviousStudy(
                    previous_study_element
                );
            },
            values
        );

        this.#previous_study_elements.push(previous_study_element);

        this.#form_element.before(previous_study_element);

        return previous_study_element;
    }

    /**
     * @returns {Promise<void>}
     */
    async #chosenPreviousStudies() {
        if (!await (async () => {
            for (const previous_study_element of this.#previous_study_elements) {
                if (!await previous_study_element.validate()) {
                    return false;
                }
            }

            return true;
        })() || !await this.#form_element.validate()) {
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
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA
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
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.append(TitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_YOUR_PREVIOUS_STUDIES
            )
        ));

        this.#form_element = FormElement.new(
            this.#flux_localization_api
        );

        const subtitle_element = this.#form_element.addSubtitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PLEASE_INDICATE_ALL_YOUR_UNIVERSITY_STUDIES_EVEN_IF_YOU_DID_NOT_COMPLETE_THEM
            )
        );

        const add_previous_study_element = FormButtonElement.new(
            "+"
        );
        add_previous_study_element.button.addEventListener("click", () => {
            this.#addPreviousStudy();
        });
        subtitle_element.before(add_previous_study_element);

        await this.#form_element.addButtons(
            () => {
                this.#chosenPreviousStudies();
            },
            this.#back_function
        );

        this.#shadow.append(this.#form_element);

        this.#shadow.append(MandatoryElement.new(
            this.#flux_localization_api
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

export const PREVIOUS_STUDIES_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_PREVIOUS_STUDIES}`;

customElements.define(PREVIOUS_STUDIES_ELEMENT_TAG_NAME, PreviousStudiesElement);
