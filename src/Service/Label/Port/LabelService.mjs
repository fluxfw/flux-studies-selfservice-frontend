/** @typedef {import("../../../Adapter/AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../../../Adapter/Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../../../Adapter/Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../../../Adapter/CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../../../Adapter/Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../../Adapter/Country/Country.mjs").Country} Country */
/** @typedef {import("../../../Adapter/DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../../../Adapter/DegreeTitle/DegreeTitle.mjs").DegreeTitle} DegreeTitle */
/** @typedef {import("../../../Adapter/Label/Label.mjs").Label} Label */
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
        return await this.#getLabel(
            legal["agb-label"]
        ) ?? "";
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLink(legal) {
        return await this.#getLabel(
            legal["agb-links"]
        ) ?? "";
    }

    /**
     * @param {AreaCode} area_code
     * @returns {Promise<string>}
     */
    async getAreaCodeLabel(area_code) {
        return await this.#getLabel(
            area_code.label
        ) ?? area_code.id ?? "";
    }

    /**
     * @param {Canton} canton
     * @returns {Promise<string>}
     */
    async getCantonLabel(canton) {
        return await this.#getLabel(
            canton.label
        ) ?? canton.id ?? "";
    }

    /**
     * @param {Certificate} certificate
     * @returns {Promise<string>}
     */
    async getCertificateLabel(certificate) {
        return await this.#getLabel(
            certificate.label
        ) ?? certificate.id ?? "";
    }

    /**
     * @param {CertificateType} certificate_type
     * @returns {Promise<string>}
     */
    async getCertificateTypeLabel(certificate_type) {
        return await this.#getLabel(
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
                label: await this.#getLabel(
                    combination.label
                ) ?? combination.id ?? ""
            }
        );
    }

    /**
     * @param {Country} country
     * @returns {Promise<string>}
     */
    async getCountryLabel(country) {
        return await this.#getLabel(
            country.label
        ) ?? country.id ?? "";
    }

    /**
     * @param {DegreeTitle} degree_title
     * @returns {Promise<string>}
     */
    async getDegreeTitleLabel(degree_title) {
        return await this.#getLabel(
            degree_title.label
        ) ?? degree_title.id ?? "";
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {Promise<string>}
     */
    async getDegreeProgramLabel(degree_program) {
        return await this.#getLabel(
            degree_program.label
        ) ?? degree_program.id ?? "";
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
     * @param {Label} error_message
     * @returns {Promise<string>}
     */
    async getErrorMessageLabel(error_message) {
        return await this.#getLabel(
            error_message
        ) ?? "";
    }

    /**
     * @param {Language} language
     * @returns {Promise<string>}
     */
    async getLanguageLabel(language) {
        return await this.#getLabel(
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
        return await this.#getLabel(
            place.label
        ) ?? place.id ?? "";
    }

    /**
     * @param {Portrait} portrait
     * @returns {Promise<string>}
     */
    async getPhotoCriteriaLink(portrait) {
        return await this.#getLabel(
            portrait["photo-criteria-links"]
        ) ?? "";
    }

    /**
     * @param {Qualification} qualification
     * @returns {Promise<string>}
     */
    async getQualificationLabel(qualification) {
        return await this.#getLabel(
            qualification.label
        ) ?? qualification.id ?? "";
    }

    /**
     * @param {Salutation} salutation
     * @returns {Promise<string>}
     */
    async getSalutationLabel(salutation) {
        return await this.#getLabel(
            salutation.label
        ) ?? salutation.id ?? "";
    }

    /**
     * @param {School} school
     * @returns {Promise<string>}
     */
    async getSchoolLabel(school) {
        return await this.#getLabel(
            school.label
        ) ?? school.id ?? "";
    }

    /**
     * @param {Semester} semester
     * @returns {Promise<string>}
     */
    async getSemesterLabel(semester) {
        return await this.#getLabel(
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
        return this.#localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: this.getEctLabel(
                    subject.ect
                ),
                label: await this.#getLabel(
                    subject.label
                ) ?? subject.id ?? ""
            }
        );
    }

    /**
     * @param {Label} label
     * @returns {Promise<string | null>}
     */
    async #getLabel(label) {
        return label[await this.#localization_api.getLanguage()] ?? label.en ?? null;
    }
}
