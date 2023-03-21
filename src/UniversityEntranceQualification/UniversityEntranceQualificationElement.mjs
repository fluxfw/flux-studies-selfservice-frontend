import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_CANTON, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_COUNTRY, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_PLACE, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_TYPE, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_ISSUE_YEAR, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_MATURA_CANTON, UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_UPPER_SECONDARY_SCHOOL } from "./UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenUniversityEntranceQualificationFunction.mjs").chosenUniversityEntranceQualificationFunction} chosenUniversityEntranceQualificationFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./UniversityEntranceQualification.mjs").UniversityEntranceQualification} UniversityEntranceQualification */
/** @typedef {import("./UniversityEntranceQualificationData.mjs").UniversityEntranceQualificationData} UniversityEntranceQualificationData */
/** @typedef {import("./UniversityEntranceQualificationSelectOption.mjs").UniversityEntranceQualificationSelectOption} UniversityEntranceQualificationSelectOption */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/UniversityEntranceQualificationElement.css`
);

export class UniversityEntranceQualificationElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenUniversityEntranceQualificationFunction}
     */
    #chosen_university_entrance_qualification_function;
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
     * @type {[HTMLSelectElement, UniversityEntranceQualificationData[], UniversityEntranceQualificationSelectOption[]][]}
     */
    #selects;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {UniversityEntranceQualification}
     */
    #university_entrance_qualification;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {UniversityEntranceQualification} university_entrance_qualification
     * @param {chosenUniversityEntranceQualificationFunction} chosen_university_entrance_qualification_function
     * @param {backFunction | null} back_function
     * @returns {UniversityEntranceQualificationElement}
     */
    static new(flux_localization_api, label_service, university_entrance_qualification, chosen_university_entrance_qualification_function, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            university_entrance_qualification,
            chosen_university_entrance_qualification_function,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {UniversityEntranceQualification} university_entrance_qualification
     * @param {chosenUniversityEntranceQualificationFunction} chosen_university_entrance_qualification_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, university_entrance_qualification, chosen_university_entrance_qualification_function, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#university_entrance_qualification = university_entrance_qualification;
        this.#chosen_university_entrance_qualification_function = chosen_university_entrance_qualification_function;
        this.#back_function = back_function;
        this.#selects = [];

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
    async #chosenUniversityEntranceQualification() {
        if (!await this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_university_entrance_qualification_function(
            Object.fromEntries([
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_CANTON,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_COUNTRY,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_PLACE,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_TYPE,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_ISSUE_YEAR,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_MATURA_CANTON,
                UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_UPPER_SECONDARY_SCHOOL
            ].map(select_type => [
                select_type,
                this.#form_element.inputs[select_type]?.value ?? null
            ]).filter(([
                ,
                value
            ]) => value !== null))
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
                "University entrance qualification"
            )
        ));

        this.#form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Upper secondary school-leaving certificate"
            )
        );

        this.#form_element.addSubtitle(
            await this.#flux_localization_api.translate(
                "Please enter your educational qualifications that qualify you to apply for admission to a degree program"
            )
        );

        await this.#nextSelect(
            this.#university_entrance_qualification["select-index"]
        );

        await this.#form_element.addButtons(
            () => {
                this.#chosenUniversityEntranceQualification();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#flux_localization_api
        ));

        if (this.#university_entrance_qualification.values !== null) {
            await this.#initValues();
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #initValues() {
        const [
            select_element
        ] = this.#selects[this.#selects.length - 1];

        if (select_element.value !== "") {
            return;
        }

        const value = this.#university_entrance_qualification.values[select_element.name] ?? null;

        if (value === null) {
            return;
        }

        select_element.value = value;

        await this.#selected(
            select_element
        );

        await this.#initValues();
    }

    /**
     * @param {number} select_index
     * @returns {Promise<void>}
     */
    async #nextSelect(select_index) {
        const [
            select_to_data_index,
            select_options
        ] = this.#university_entrance_qualification.selects[select_index];

        const [
            select_type,
            data_index
        ] = this.#university_entrance_qualification["select-to-data"][select_to_data_index];

        const data = this.#university_entrance_qualification.data[data_index];

        let label, get_option_label;
        switch (select_type) {
            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE:
                label = "Certificate";
                get_option_label = "getCertificateLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_CANTON:
                label = "The canton of your political commune where you were registered at the time you were awarded your certificate";
                get_option_label = "getCantonLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_COUNTRY:
                label = "The country where you were registered at the time you were awarded your certificate";
                get_option_label = "getCountryLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_PLACE:
                label = "Legal place of residence when the certificate was awarded";
                get_option_label = "getPlaceLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_CERTIFICATE_TYPE:
                label = "Type of certificate";
                get_option_label = "getCertificateTypeLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_ISSUE_YEAR:
                label = "Year of issue";
                get_option_label = "getIssueYearLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_MATURA_CANTON:
                label = "The canton, in which the school is located where you were awarded your matura";
                get_option_label = "getCantonLabel";
                break;

            case UNIVERSITY_ENTRANCE_QUALIFICATION_SELECT_TYPE_UPPER_SECONDARY_SCHOOL:
                label = "Upper secondary school";
                get_option_label = "getSchoolLabel";
                break;

            default:
                return;
        }

        const select_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                label
            ),
            "select",
            select_type
        );
        select_element.required = true;

        for (const select_option of select_options) {
            const option = data[typeof select_option === "number" ? select_option : select_option[0]];

            const option_element = document.createElement("option");
            option_element.text = await this.#label_service[get_option_label](
                option
            );
            option_element.value = option.id;
            select_element.appendChild(option_element);
        }

        select_element.addEventListener("input", () => {
            this.#selected(
                select_element
            );
        });

        this.#selects.push([
            select_element,
            data,
            select_options
        ]);
    }

    /**
     * @param {HTMLSelectElement} select_element
     * @returns {Promise<void>}
     */
    async #selected(select_element) {
        const select_index = this.#selects.findIndex(([
            _select_element
        ]) => _select_element === select_element);

        if (select_index === -1) {
            return;
        }

        if (this.#selects.length > (select_index + 1)) {
            for (const [
                _select_element
            ] of this.#selects.slice(select_index + 1)) {
                _select_element.parentElement.remove();
            }

            this.#selects = this.#selects.slice(0, select_index + 1);
        }

        const [
            ,
            data,
            select_options
        ] = this.#selects[select_index];

        const data_index = data.findIndex(option => option.id === select_element.value);

        const select_option = select_options.find(_select_option => (typeof _select_option === "number" ? _select_option : _select_option[0]) === data_index) ?? null;

        if (select_option === null || typeof select_option === "number") {
            return;
        }

        await this.#nextSelect(
            select_option[1]
        );
    }
}

export const UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION}`;

customElements.define(UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME, UniversityEntranceQualificationElement);
