import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Canton/CantonWithPlaces.mjs").CantonWithPlaces} CantonWithPlaces */
/** @typedef {import("../Canton/CantonWithSchools.mjs").CantonWithSchools} CantonWithSchools */
/** @typedef {import("../CertificateType/CertificateTypeWithCertificates.mjs").CertificateTypeWithCertificates} CertificateTypeWithCertificates */
/** @typedef {import("../Certificate/CertificateWithCantons.mjs").CertificateWithCantons} CertificateWithCantons */
/** @typedef {import("./chosenUniversityEntranceQualificationFunction.mjs").chosenUniversityEntranceQualificationFunction} chosenUniversityEntranceQualificationFunction */
/** @typedef {import("../Country/CountryWithCantons.mjs").CountryWithCantons} CountryWithCantons */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../School/SchoolWithCountries.mjs").SchoolWithCountries} SchoolWithCountries */
/** @typedef {import("./UniversityEntranceQualification.mjs").UniversityEntranceQualification} UniversityEntranceQualification */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class UniversityEntranceQualificationElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {CertificateWithCantons | null}
     */
    #certificate = null;
    /**
     * @type {CantonWithPlaces | null}
     */
    #certificate_canton = null;
    /**
     * @type {CountryWithCantons | null}
     */
    #certificate_country = null;
    /**
     * @type {CertificateTypeWithCertificates | null}
     */
    #certificate_type = null;
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
     * @type {CantonWithSchools | null}
     */
    #matura_canton = null;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {UniversityEntranceQualification}
     */
    #university_entrance_qualification;
    /**
     * @type {SchoolWithCountries | null}
     */
    #upper_secondary_school = null;

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
        if (!await this.#form_element.validate()) {
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
                await this.#localization_api.translate(
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
            this.#css_api,
            await this.#localization_api.translate(
                "University entrance qualification"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#form_element.addTitle(
            await this.#localization_api.translate(
                "Upper secondary school-leaving certificate"
            )
        );

        this.#form_element.addSubtitle(
            await this.#localization_api.translate(
                "Please enter your educational qualifications that qualify you to apply for admission to a degree program"
            )
        );

        const certificate_type_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "Type of certificate"
            ),
            "select",
            "certificate-type"
        );
        certificate_type_element.required = true;

        for (const certificate_type of this.#university_entrance_qualification["certificate-types"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCertificateTypeLabel(
                certificate_type
            );
            option_element.value = certificate_type.id;
            certificate_type_element.appendChild(option_element);
        }

        certificate_type_element.addEventListener("input", () => {
            this.#renderCertificates();
        });

        const issue_date_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "Date of issue (Year)"
            ),
            "number",
            "issue-date"
        );
        issue_date_element.inputMode = "numeric";
        issue_date_element.required = true;
        issue_date_element.step = 1;

        const certificate_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "Certificate"
            ),
            "select",
            "certificate"
        );
        certificate_element.required = true;

        certificate_element.addEventListener("input", () => {
            this.#renderMaturaCantons();
        });

        const matura_canton_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "The canton, in which the school is located where you were awarded your matura"
            ),
            "select",
            "matura-canton"
        );
        matura_canton_element.required = true;

        matura_canton_element.addEventListener("input", () => {
            this.#renderUpperSecondarySchool();
        });

        const upper_secondary_school_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "Upper secondary school"
            ),
            "select",
            "upper-secondary-school"
        );
        upper_secondary_school_element.required = true;

        upper_secondary_school_element.addEventListener("input", () => {
            this.#renderCertificateCountries();
        });

        const certificate_country_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "The country where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-country"
        );
        certificate_country_element.required = true;

        certificate_country_element.addEventListener("input", () => {
            this.#renderCertificateCantons();
        });

        const certificate_canton_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "The canton of your political commune where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-canton"
        );
        certificate_canton_element.required = true;

        certificate_canton_element.addEventListener("input", () => {
            this.#renderCertificatePlaces();
        });

        const certificate_place_element = this.#form_element.addInput(
            await this.#localization_api.translate(
                "Legal place of residence when the certificate was awarded"
            ),
            "select",
            "certificate-place"
        );
        certificate_place_element.required = true;

        await this.#form_element.addButtons(
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
            await this.#renderCertificates();

            issue_date_element.valueAsNumber = this.#university_entrance_qualification.values["issue-date"];

            certificate_element.value = this.#university_entrance_qualification.values.certificate;
            await this.#renderMaturaCantons();

            matura_canton_element.value = this.#university_entrance_qualification.values["matura-canton"];
            await this.#renderUpperSecondarySchool();

            upper_secondary_school_element.value = this.#university_entrance_qualification.values["upper-secondary-school"];
            await this.#renderCertificateCountries();

            certificate_country_element.value = this.#university_entrance_qualification.values["certificate-country"];
            await this.#renderCertificateCantons();

            certificate_canton_element.value = this.#university_entrance_qualification.values["certificate-canton"];
            await this.#renderCertificatePlaces();

            certificate_place_element.value = this.#university_entrance_qualification.values["certificate-place"];
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderCertificateCantons() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs["certificate-canton"]
        );

        this.#certificate_country = this.#upper_secondary_school?.countries?.find(country => country.id === this.#form_element.inputs["certificate-country"].value) ?? null;

        await this.#renderCertificatePlaces();

        if (this.#certificate_country === null) {
            return;
        }

        for (const canton of this.#certificate_country.cantons) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            this.#form_element.inputs["certificate-canton"].appendChild(option_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderCertificateCountries() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs["certificate-country"]
        );

        this.#upper_secondary_school = this.#matura_canton?.schools?.find(school => school.id === this.#form_element.inputs["upper-secondary-school"].value) ?? null;

        await this.#renderCertificateCantons();

        if (this.#upper_secondary_school === null) {
            return;
        }

        for (const country of this.#upper_secondary_school.countries) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            this.#form_element.inputs["certificate-country"].appendChild(option_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderCertificatePlaces() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs["certificate-place"]
        );

        this.#certificate_canton = this.#certificate_country?.cantons?.find(canton => canton.id === this.#form_element.inputs["certificate-canton"].value) ?? null;

        if (this.#certificate_canton === null) {
            return;
        }

        for (const place of this.#certificate_canton.places) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            this.#form_element.inputs["certificate-place"].appendChild(option_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderCertificates() {
        this.#form_element.inputs["issue-date"].max = 0;
        this.#form_element.inputs["issue-date"].min = 0;
        this.#form_element.inputs["issue-date"].value = "";

        this.#form_element.clearSelectOptions(
            this.#form_element.inputs.certificate
        );

        this.#certificate_type = this.#university_entrance_qualification["certificate-types"].find(certificate_type => certificate_type.id === this.#form_element.inputs["certificate-type"].value) ?? null;

        await this.#renderMaturaCantons();

        if (this.#certificate_type === null) {
            return;
        }

        this.#form_element.inputs["issue-date"].max = this.#certificate_type["max-issue-date"];
        this.#form_element.inputs["issue-date"].min = this.#certificate_type["min-issue-date"];

        for (const certificate of this.#certificate_type.certificates) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCertificateLabel(
                certificate
            );
            option_element.value = certificate.id;
            this.#form_element.inputs.certificate.appendChild(option_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderMaturaCantons() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs["matura-canton"]
        );

        this.#certificate = this.#certificate_type?.certificates?.find(certificate => certificate.id === this.#form_element.inputs.certificate.value) ?? null;

        await this.#renderUpperSecondarySchool();

        if (this.#certificate === null) {
            return;
        }

        for (const canton of this.#certificate.cantons) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            this.#form_element.inputs["matura-canton"].appendChild(option_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderUpperSecondarySchool() {
        this.#form_element.clearSelectOptions(
            this.#form_element.inputs["upper-secondary-school"]
        );

        this.#matura_canton = this.#certificate?.cantons?.find(canton => canton.id === this.#form_element.inputs["matura-canton"].value) ?? null;

        await this.#renderCertificateCountries();

        if (this.#matura_canton === null) {
            return;
        }

        for (const school of this.#matura_canton.schools) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getSchoolLabel(
                school
            );
            option_element.value = school.id;
            this.#form_element.inputs["upper-secondary-school"].appendChild(option_element);
        }
    }
}

export const UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION}`;

customElements.define(UNIVERSITY_ENTRANCE_QUALIFICATION_ELEMENT_TAG_NAME, UniversityEntranceQualificationElement);
