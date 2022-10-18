import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenUniversityEntranceQualificationFunction.mjs").chosenUniversityEntranceQualificationFunction} chosenUniversityEntranceQualificationFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./UniversityEntranceQualification.mjs").UniversityEntranceQualification} UniversityEntranceQualification */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

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
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {UniversityEntranceQualification}
     */
    #university_entrance_qualification;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {UniversityEntranceQualification} university_entrance_qualification
     * @param {chosenUniversityEntranceQualificationFunction} chosen_university_entrance_qualification_function
     * @param {backFunction | null} back_function
     * @returns {UniversityEntranceQualificationElement}
     */
    static new(css_api, label_service, localization_api, university_entrance_qualification, chosen_university_entrance_qualification_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            university_entrance_qualification,
            chosen_university_entrance_qualification_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {UniversityEntranceQualification} university_entrance_qualification
     * @param {chosenUniversityEntranceQualificationFunction} chosen_university_entrance_qualification_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, university_entrance_qualification, chosen_university_entrance_qualification_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#university_entrance_qualification = university_entrance_qualification;
        this.#chosen_university_entrance_qualification_function = chosen_university_entrance_qualification_function;
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
    async #chosenUniversityEntranceQualification() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_university_entrance_qualification_function(
            {
                "certificate-type": this.#form_element.inputs["certificate-type"].value,
                "issue-date": this.#form_element.inputs["issue-date"].valueAsNumber,
                certificate: this.#form_element.inputs.certificate.value,
                "matura-canton": this.#form_element.inputs["matura-canton"].value,
                "upper-secondary-school": this.#form_element.inputs["upper-secondary-school"].value,
                "certificate-country": this.#form_element.inputs["certificate-country"].value,
                "certificate-canton": this.#form_element.inputs["certificate-canton"].value,
                "certificate-place": this.#form_element.inputs["certificate-place"].value
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
                "University entrance qualification"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Upper secondary school-leaving certificate"
            )
        );

        this.#form_element.addSubtitle(
            this.#localization_api.translate(
                "Please enter your educational qualifications that qualify you to apply for admission to a degree program"
            )
        );

        const certificate_type_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Type of certificate"
            ),
            "select",
            "certificate-type"
        );
        certificate_type_element.required = true;

        for (const certificate_type of this.#university_entrance_qualification["certificate-types"]) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCertificateTypeLabel(
                certificate_type
            );
            option_element.value = certificate_type.id;
            certificate_type_element.appendChild(option_element);
        }

        const issue_date_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Date of issue (Year)"
            ),
            "number",
            "issue-date"
        );
        issue_date_element.inputMode = "numeric";
        issue_date_element.max = this.#university_entrance_qualification["max-issue-date"];
        issue_date_element.min = this.#university_entrance_qualification["min-issue-date"];
        issue_date_element.required = true;
        issue_date_element.step = 1;

        const certificate_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Certificate"
            ),
            "select",
            "certificate"
        );
        certificate_element.required = true;

        for (const certificate of this.#university_entrance_qualification.certificates) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCertificateLabel(
                certificate
            );
            option_element.value = certificate.id;
            certificate_element.appendChild(option_element);
        }

        const matura_canton_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "The canton, in which the school is located where you were awarded your Matura"
            ),
            "select",
            "matura-canton"
        );
        matura_canton_element.required = true;

        for (const canton of this.#university_entrance_qualification.cantons) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            matura_canton_element.appendChild(option_element);
        }

        const upper_secondary_school_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Upper secondary school"
            ),
            "select",
            "upper-secondary-school"
        );
        upper_secondary_school_element.required = true;

        for (const school of this.#university_entrance_qualification.schools) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getSchoolLabel(
                school
            );
            option_element.value = school.id;
            upper_secondary_school_element.appendChild(option_element);
        }

        const certificate_country_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "The country where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-country"
        );
        certificate_country_element.required = true;

        for (const country of this.#university_entrance_qualification.countries) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            certificate_country_element.appendChild(option_element);
        }

        const certificate_canton_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "The canton of your political commune where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-canton"
        );
        certificate_canton_element.required = true;

        for (const canton of this.#university_entrance_qualification.cantons) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            certificate_canton_element.appendChild(option_element);
        }

        const certificate_place_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Legal place of residence when the certificate was awarded"
            ),
            "select",
            "certificate-place"
        );
        certificate_place_element.required = true;

        for (const place of this.#university_entrance_qualification.places) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            certificate_place_element.appendChild(option_element);
        }

        this.#form_element.addButtons(
            () => {
                this.#chosenUniversityEntranceQualification();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
        ));

        if (this.#university_entrance_qualification.values !== null) {
            certificate_type_element.value = this.#university_entrance_qualification.values["certificate-type"];

            issue_date_element.valueAsNumber = this.#university_entrance_qualification.values["issue-date"];

            certificate_element.value = this.#university_entrance_qualification.values.certificate;

            matura_canton_element.value = this.#university_entrance_qualification.values["matura-canton"];

            upper_secondary_school_element.value = this.#university_entrance_qualification.values["upper-secondary-school"];

            certificate_country_element.value = this.#university_entrance_qualification.values["certificate-country"];

            certificate_canton_element.value = this.#university_entrance_qualification.values["certificate-canton"];

            certificate_place_element.value = this.#university_entrance_qualification.values["certificate-place"];
        }
    }
}

export const UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION}`;

customElements.define(UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME, UniversityEntranceQualificationElement);
