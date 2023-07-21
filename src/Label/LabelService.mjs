import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_ECT_ECT, LOCALIZATION_KEY_LABEL_ECT } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../CorrespondenceLanguage/CorrespondenceLanguage.mjs").CorrespondenceLanguage} CorrespondenceLanguage */
/** @typedef {import("../Country/Country.mjs").Country} Country */
/** @typedef {import("../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../DegreeTitle/DegreeTitle.mjs").DegreeTitle} DegreeTitle */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../IssueYear/IssueYear.mjs").IssueYear} IssueYear */
/** @typedef {import("./Label.mjs").Label} Label */
/** @typedef {import("../Language/Language.mjs").Language} Language */
/** @typedef {import("../Legal/Legal.mjs").Legal} Legal */
/** @typedef {import("../Combination/Mandatory.mjs").Mandatory} Mandatory */
/** @typedef {import("../MotherLanguage/MotherLanguage.mjs").MotherLanguage} MotherLanguage */
/** @typedef {import("../Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */
/** @typedef {import("../Nationally/Nationally.mjs").Nationally} Nationally */
/** @typedef {import("../OriginPlace/OriginPlace.mjs").OriginPlace} OriginPlace */
/** @typedef {import("../Place/Place.mjs").Place} Place */
/** @typedef {import("../Portrait/Portrait.mjs").Portrait} Portrait */
/** @typedef {import("../Qualification/Qualification.mjs").Qualification} Qualification */
/** @typedef {import("../Salutation/Salutation.mjs").Salutation} Salutation */
/** @typedef {import("../School/School.mjs").School} School */
/** @typedef {import("../Semester/Semester.mjs").Semester} Semester */
/** @typedef {import("../Combination/SingleChoice.mjs").SingleChoice} SingleChoice */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

export class LabelService {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {LabelService}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLabel(legal) {
        return await this.getLabel(
            legal["agb-label"]
        ) ?? "";
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLink(legal) {
        return await this.getLabel(
            legal["agb-links"]
        ) ?? "";
    }

    /**
     * @param {AreaCode} area_code
     * @returns {Promise<string>}
     */
    async getAreaCodeLabel(area_code) {
        return await this.getLabel(
            area_code.label
        ) ?? area_code.id ?? "";
    }

    /**
     * @param {Canton} canton
     * @returns {Promise<string>}
     */
    async getCantonLabel(canton) {
        return await this.getLabel(
            canton.label
        ) ?? canton.id ?? "";
    }

    /**
     * @param {Certificate} certificate
     * @returns {Promise<string>}
     */
    async getCertificateLabel(certificate) {
        return await this.getLabel(
            certificate.label
        ) ?? certificate.id ?? "";
    }

    /**
     * @param {CertificateType} certificate_type
     * @returns {Promise<string>}
     */
    async getCertificateTypeLabel(certificate_type) {
        return await this.getLabel(
            certificate_type.label
        ) ?? certificate_type.id ?? "";
    }

    /**
     * @param {Choice} choice
     * @returns {Promise<string>}
     */
    async getChoiceLabel(choice) {
        return this.getSubjectLabel(
            choice
        );
    }

    /**
     * @param {Choice[]} choices
     * @returns {Promise<string>}
     */
    async getChoicesLabel(choices) {
        return (await Promise.all(choices.map(async choice => this.getChoiceLabel(
            choice
        )))).join("\n");
    }

    /**
     * @param {Combination} combination
     * @returns {Promise<string>}
     */
    async getCombinationLabel(combination) {
        return this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_LABEL_ECT,
            {
                ect: await this.getEctLabel(
                    [
                        ...combination.mandatory?.map(mandatory => mandatory.ect) ?? [],
                        ...combination["single-choice"]?.map(single_choice => single_choice.ect) ?? [],
                        ...combination["multiple-choice"]?.map(multiple_choice => multiple_choice.ect) ?? []
                    ]
                ),
                label: await this.getLabel(
                    combination.label
                ) ?? combination.id ?? ""
            }
        );
    }

    /**
     * @param {CorrespondenceLanguage} correspondence_language
     * @returns {Promise<string>}
     */
    async getCorrespondenceLanguageLabel(correspondence_language) {
        return this.getLanguageLabel(
            correspondence_language
        );
    }

    /**
     * @param {Country} country
     * @returns {Promise<string>}
     */
    async getCountryLabel(country) {
        return await this.getLabel(
            country.label
        ) ?? country.id ?? "";
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {Promise<string>}
     */
    async getDegreeProgramLabel(degree_program) {
        return await this.getLabel(
            degree_program.label
        ) ?? degree_program.id ?? "";
    }

    /**
     * @param {DegreeTitle} degree_title
     * @returns {Promise<string>}
     */
    async getDegreeTitleLabel(degree_title) {
        return await this.getLabel(
            degree_title.label
        ) ?? degree_title.id ?? "";
    }

    /**
     * @param {number | number[]} ect
     * @returns {Promise<string>}
     */
    async getEctLabel(ect) {
        let _ect;
        if (Array.isArray(ect)) {
            _ect = ect.join(", ");
        } else {
            _ect = ect;
        }

        return this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_ECT_ECT,
            {
                ect: _ect
            }
        );
    }

    /**
     * @param {Label} error_message
     * @returns {Promise<string>}
     */
    async getErrorMessageLabel(error_message) {
        return await this.getLabel(
            error_message
        ) ?? "";
    }

    /**
     * @param {IssueYear} issue_year
     * @returns {Promise<string>}
     */
    async getIssueYearLabel(issue_year) {
        return issue_year.id ?? "";
    }

    /**
     * @param {Label} label
     * @returns {Promise<string | null>}
     */
    async getLabel(label) {
        return typeof label === "string" ? label : label[(await this.#flux_localization_api.getLanguage(
            LOCALIZATION_MODULE
        )).language] ?? label.en ?? Object.values(label)[0] ?? null;
    }

    /**
     * @param {Language} language
     * @returns {Promise<string>}
     */
    async getLanguageLabel(language) {
        return await this.getLabel(
            language.label
        ) ?? language.id ?? "";
    }

    /**
     * @param {Mandatory} mandatory
     * @returns {Promise<string>}
     */
    async getMandatoryLabel(mandatory) {
        return this.getSubjectLabel(
            mandatory
        );
    }

    /**
     * @param {MotherLanguage} mother_language
     * @returns {Promise<string>}
     */
    async getMotherLanguageLabel(mother_language) {
        return this.getLanguageLabel(
            mother_language
        );
    }

    /**
     * @param {MultipleChoice} multiple_choice
     * @returns {Promise<string>}
     */
    async getMultipleChoiceLabel(multiple_choice) {
        return this.getSingleChoiceLabel(
            multiple_choice
        );
    }

    /**
     * @param {Combination | null} combination
     * @returns {Promise<string>}
     */
    async getMultipleMandatoryLabel(combination = null) {
        if ((combination?.mandatory ?? null) === null) {
            return "-";
        }

        return (await Promise.all(combination.mandatory.map(async mandatory => this.getMandatoryLabel(
            mandatory
        )))).join("\n");
    }

    /**
     * @param {Nationally} nationally
     * @returns {Promise<string>}
     */
    async getNationallyLabel(nationally) {
        return await this.getLabel(
            nationally.label
        ) ?? nationally.id ?? "";
    }

    /**
     * @param {OriginPlace} origin_place
     * @returns {Promise<string>}
     */
    async getOriginPlaceLabel(origin_place) {
        return this.getPlaceLabel(
            origin_place
        );
    }

    /**
     * @param {Portrait} portrait
     * @returns {Promise<string>}
     */
    async getPhotoCriteriaLink(portrait) {
        return await this.getLabel(
            portrait["photo-criteria-links"]
        ) ?? "";
    }

    /**
     * @param {Place} place
     * @returns {Promise<string>}
     */
    async getPlaceLabel(place) {
        return await this.getLabel(
            place.label
        ) ?? place.id ?? "";
    }

    /**
     * @param {Qualification} qualification
     * @returns {Promise<string>}
     */
    async getQualificationLabel(qualification) {
        return await this.getLabel(
            qualification.label
        ) ?? qualification.id ?? "";
    }

    /**
     * @param {Salutation} salutation
     * @returns {Promise<string>}
     */
    async getSalutationLabel(salutation) {
        return await this.getLabel(
            salutation.label
        ) ?? salutation.id ?? "";
    }

    /**
     * @param {School} school
     * @returns {Promise<string>}
     */
    async getSchoolLabel(school) {
        return await this.getLabel(
            school.label
        ) ?? school.id ?? "";
    }

    /**
     * @param {Semester} semester
     * @returns {Promise<string>}
     */
    async getSemesterLabel(semester) {
        return await this.getLabel(
            semester.label
        ) ?? semester.id ?? "";
    }

    /**
     * @param {SingleChoice} single_choice
     * @returns {Promise<string>}
     */
    async getSingleChoiceLabel(single_choice) {
        return this.getSubjectLabel(
            single_choice
        );
    }

    /**
     * @param {Subject} subject
     * @returns {Promise<string>}
     */
    async getSubjectLabel(subject) {
        return this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_LABEL_ECT,
            {
                ect: await this.getEctLabel(
                    subject.ect
                ),
                label: await this.getLabel(
                    subject.label
                ) ?? subject.id ?? ""
            }
        );
    }
}
