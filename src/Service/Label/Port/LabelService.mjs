/** @typedef {import("../../../Adapter/AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../../../Adapter/Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../../../Adapter/Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../../../Adapter/CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../../../Adapter/Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../../Adapter/Country/Country.mjs").Country} Country */
/** @typedef {import("../../../Adapter/DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../../../Adapter/DegreeTitle/DegreeTitle.mjs").DegreeTitle} DegreeTitle */
/** @typedef {import("../../../Adapter/Language/Language.mjs").Language} Language */
/** @typedef {import("../../../Adapter/Legal/Legal.mjs").Legal} Legal */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Combination/Mandatory.mjs").Mandatory} Mandatory */
/** @typedef {import("../../../Adapter/Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */
/** @typedef {import("../../../Adapter/Place/Place.mjs").Place} Place */
/** @typedef {import("../../../Adapter/Portrait/Portrait.mjs").Portrait} Portrait */
/** @typedef {import("../../../Adapter/Qualification/Qualification.mjs").Qualification} Qualification */
/** @typedef {import("../../../Adapter/Salutation/Salutation.mjs").Salutation} Salutation */
/** @typedef {import("../../../Adapter/Combination/SingleChoice.mjs").SingleChoice} SingleChoice */
/** @typedef {import("../../../Adapter/School/School.mjs").School} School */
/** @typedef {import("../../../Adapter/Semester/Semester.mjs").Semester} Semester */
/** @typedef {import("../../../Adapter/Subject/Subject.mjs").Subject} Subject */

export class LabelService {
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LocalizationApi} localization_api
     * @returns {LabelService}
     */
    static new(localization_api) {
        return new this(
            localization_api
        );
    }

    /**
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(localization_api) {
        this.#localization_api = localization_api;
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLabel(legal) {
        return legal["agb-label"][await this.#localization_api.getLanguage()] ?? legal["agb-label"].en ?? "";
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLink(legal) {
        return legal["agb-links"][await this.#localization_api.getLanguage()] ?? legal["agb-links"].en ?? "";
    }

    /**
     * @param {AreaCode} area_code
     * @returns {Promise<string>}
     */
    async getAreaCodeLabel(area_code) {
        return area_code.label[await this.#localization_api.getLanguage()] ?? area_code.label.en ?? area_code.id ?? "";
    }

    /**
     * @param {Canton} canton
     * @returns {Promise<string>}
     */
    async getCantonLabel(canton) {
        return canton.label[await this.#localization_api.getLanguage()] ?? canton.label.en ?? canton.id ?? "";
    }

    /**
     * @param {Certificate} certificate
     * @returns {Promise<string>}
     */
    async getCertificateLabel(certificate) {
        return certificate.label[await this.#localization_api.getLanguage()] ?? certificate.label.en ?? certificate.id ?? "";
    }

    /**
     * @param {CertificateType} certificate_type
     * @returns {Promise<string>}
     */
    async getCertificateTypeLabel(certificate_type) {
        return certificate_type.label[await this.#localization_api.getLanguage()] ?? certificate_type.label.en ?? certificate_type.id ?? "";
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
        return this.#localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: this.getEctLabel(
                    [
                        ...combination.mandatory?.map(mandatory => mandatory.ect) ?? [],
                        ...combination["single-choice"]?.map(single_choice => single_choice.ect) ?? [],
                        ...combination["multiple-choice"]?.map(multiple_choice => multiple_choice.ect) ?? []
                    ]
                ),
                label: combination.label[await this.#localization_api.getLanguage()] ?? combination.label.en ?? combination.id ?? ""
            }
        );
    }

    /**
     * @param {Country} country
     * @returns {Promise<string>}
     */
    async getCountryLabel(country) {
        return country.label[await this.#localization_api.getLanguage()] ?? country.label.en ?? country.id ?? "";
    }

    /**
     * @param {DegreeTitle} degree_title
     * @returns {Promise<string>}
     */
    async getDegreeTitleLabel(degree_title) {
        return degree_title.label[await this.#localization_api.getLanguage()] ?? degree_title.label.en ?? degree_title.id ?? "";
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {Promise<string>}
     */
    async getDegreeProgramLabel(degree_program) {
        return degree_program.label[await this.#localization_api.getLanguage()] ?? degree_program.label.en ?? degree_program.id ?? "";
    }

    /**
     * @param {number | number[]} ect
     * @returns {string}
     */
    getEctLabel(ect) {
        let _ect;
        if (Array.isArray(ect)) {
            _ect = ect.join(", ");
        } else {
            _ect = ect;
        }

        return this.#localization_api.translate(
            "{ect} ECT",
            null,
            {
                ect: _ect
            }
        );
    }

    /**
     * @param {Language} language
     * @returns {Promise<string>}
     */
    async getLanguageLabel(language) {
        return language.label[await this.#localization_api.getLanguage()] ?? language.label.en ?? language.id ?? "";
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
     * @param {Place} place
     * @returns {Promise<string>}
     */
    async getPlaceLabel(place) {
        return place.label[await this.#localization_api.getLanguage()] ?? place.label.en ?? place.id ?? "";
    }

    /**
     * @param {Portrait} portrait
     * @returns {Promise<string>}
     */
    async getPhotoCriteriaLink(portrait) {
        return portrait["photo-criteria-links"][await this.#localization_api.getLanguage()] ?? portrait["photo-criteria-links"].en ?? "";
    }

    /**
     * @param {Qualification} qualification
     * @returns {Promise<string>}
     */
    async getQualificationLabel(qualification) {
        return qualification.label[await this.#localization_api.getLanguage()] ?? qualification.label.en ?? qualification.id ?? "";
    }

    /**
     * @param {Salutation} salutation
     * @returns {Promise<string>}
     */
    async getSalutationLabel(salutation) {
        return salutation.label[await this.#localization_api.getLanguage()] ?? salutation.label.en ?? salutation.id ?? "";
    }

    /**
     * @param {School} school
     * @returns {Promise<string>}
     */
    async getSchoolLabel(school) {
        return school.label[await this.#localization_api.getLanguage()] ?? school.label.en ?? school.id ?? "";
    }

    /**
     * @param {Semester} semester
     * @returns {Promise<string>}
     */
    async getSemesterLabel(semester) {
        return semester.label[await this.#localization_api.getLanguage()] ?? semester.label.en ?? semester.id ?? "";
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
        return this.#localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: this.getEctLabel(
                    subject.ect
                ),
                label: subject.label[await this.#localization_api.getLanguage()] ?? subject.label.en ?? subject.id ?? ""
            }
        );
    }
}
