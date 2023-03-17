/** @typedef {import("../../AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../../Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../../Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../../CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../../Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../Country/Country.mjs").Country} Country */
/** @typedef {import("../../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../../DegreeTitle/DegreeTitle.mjs").DegreeTitle} DegreeTitle */
/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../IssueYear/IssueYear.mjs").IssueYear} IssueYear */
/** @typedef {import("../../Label/Label.mjs").Label} Label */
/** @typedef {import("../../Language/Language.mjs").Language} Language */
/** @typedef {import("../../Legal/Legal.mjs").Legal} Legal */
/** @typedef {import("../../Combination/Mandatory.mjs").Mandatory} Mandatory */
/** @typedef {import("../../Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */
/** @typedef {import("../../Place/Place.mjs").Place} Place */
/** @typedef {import("../../Portrait/Portrait.mjs").Portrait} Portrait */
/** @typedef {import("../../Qualification/Qualification.mjs").Qualification} Qualification */
/** @typedef {import("../../Salutation/Salutation.mjs").Salutation} Salutation */
/** @typedef {import("../../School/School.mjs").School} School */
/** @typedef {import("../../Semester/Semester.mjs").Semester} Semester */
/** @typedef {import("../../Combination/SingleChoice.mjs").SingleChoice} SingleChoice */
/** @typedef {import("../../Subject/Subject.mjs").Subject} Subject */

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
        return (await import("../Command/GetAgbLabelCommand.mjs")).GetAgbLabelCommand.new(
            this
        )
            .getAgbLabel(
                legal
            );
    }

    /**
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLink(legal) {
        return (await import("../Command/GetAgbLinkCommand.mjs")).GetAgbLinkCommand.new(
            this
        )
            .getAgbLink(
                legal
            );
    }

    /**
     * @param {AreaCode} area_code
     * @returns {Promise<string>}
     */
    async getAreaCodeLabel(area_code) {
        return (await import("../Command/GetAreaCodeLabelCommand.mjs")).GetAreaCodeLabelCommand.new(
            this
        )
            .getAreaCodeLabel(
                area_code
            );
    }

    /**
     * @param {Canton} canton
     * @returns {Promise<string>}
     */
    async getCantonLabel(canton) {
        return (await import("../Command/GetCantonLabelCommand.mjs")).GetCantonLabelCommand.new(
            this
        )
            .getCantonLabel(
                canton
            );
    }

    /**
     * @param {Certificate} certificate
     * @returns {Promise<string>}
     */
    async getCertificateLabel(certificate) {
        return (await import("../Command/GetCertificateLabelCommand.mjs")).GetCertificateLabelCommand.new(
            this
        )
            .getCertificateLabel(
                certificate
            );
    }

    /**
     * @param {CertificateType} certificate_type
     * @returns {Promise<string>}
     */
    async getCertificateTypeLabel(certificate_type) {
        return (await import("../Command/GetCertificateTypeLabelCommand.mjs")).GetCertificateTypeLabelCommand.new(
            this
        )
            .getCertificateTypeLabel(
                certificate_type
            );
    }

    /**
     * @param {Choice} choice
     * @returns {Promise<string>}
     */
    async getChoiceLabel(choice) {
        return (await import("../Command/GetChoiceLabelCommand.mjs")).GetChoiceLabelCommand.new(
            this
        )
            .getChoiceLabel(
                choice
            );
    }

    /**
     * @param {Choice[]} choices
     * @returns {Promise<string>}
     */
    async getChoicesLabel(choices) {
        return (await import("../Command/GetChoicesLabelCommand.mjs")).GetChoicesLabelCommand.new(
            this
        )
            .getChoicesLabel(
                choices
            );
    }

    /**
     * @param {Combination} combination
     * @returns {Promise<string>}
     */
    async getCombinationLabel(combination) {
        return (await import("../Command/GetCombinationLabelCommand.mjs")).GetCombinationLabelCommand.new(
            this.#flux_localization_api,
            this
        )
            .getCombinationLabel(
                combination
            );
    }

    /**
     * @param {Country} country
     * @returns {Promise<string>}
     */
    async getCountryLabel(country) {
        return (await import("../Command/GetCountryLabelCommand.mjs")).GetCountryLabelCommand.new(
            this
        )
            .getCountryLabel(
                country
            );
    }

    /**
     * @param {DegreeTitle} degree_title
     * @returns {Promise<string>}
     */
    async getDegreeTitleLabel(degree_title) {
        return (await import("../Command/GetDegreeTitleLabelCommand.mjs")).GetDegreeTitleLabelCommand.new(
            this
        )
            .getDegreeTitleLabel(
                degree_title
            );
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {Promise<string>}
     */
    async getDegreeProgramLabel(degree_program) {
        return (await import("../Command/GetDegreeProgramLabelCommand.mjs")).GetDegreeProgramLabelCommand.new(
            this
        )
            .getDegreeProgramLabel(
                degree_program
            );
    }

    /**
     * @param {number | number[]} ect
     * @returns {Promise<string>}
     */
    async getEctLabel(ect) {
        return (await import("../Command/GetEctLabelCommand.mjs")).GetEctLabelCommand.new(
            this.#flux_localization_api
        )
            .getEctLabel(
                ect
            );
    }

    /**
     * @param {Label} error_message
     * @returns {Promise<string>}
     */
    async getErrorMessageLabel(error_message) {
        return (await import("../Command/GetErrorMessageLabelCommand.mjs")).GetErrorMessageLabelCommand.new(
            this
        )
            .getErrorMessageLabel(
                error_message
            );
    }

    /**
     * @param {IssueYear} issue_year
     * @returns {Promise<string>}
     */
    async getIssueYearLabel(issue_year) {
        return (await import("../Command/GetIssueYearLabelCommand.mjs")).GetIssueYearLabelCommand.new()
            .getIssueYearLabel(
                issue_year
            );
    }

    /**
     * @param {Label} label
     * @returns {Promise<string | null>}
     */
    async getLabel(label) {
        return (await import("../Command/GetLabelCommand.mjs")).GetLabelCommand.new(
            this.#flux_localization_api
        )
            .getLabel(
                label
            );
    }

    /**
     * @param {Language} language
     * @returns {Promise<string>}
     */
    async getLanguageLabel(language) {
        return (await import("../Command/GetLanguageLabelCommand.mjs")).GetLanguageLabelCommand.new(
            this
        )
            .getLanguageLabel(
                language
            );
    }

    /**
     * @param {Mandatory} mandatory
     * @returns {Promise<string>}
     */
    async getMandatoryLabel(mandatory) {
        return (await import("../Command/GetMandatoryLabelCommand.mjs")).GetMandatoryLabelCommand.new(
            this
        )
            .getMandatoryLabel(
                mandatory
            );
    }

    /**
     * @param {MultipleChoice} multiple_choice
     * @returns {Promise<string>}
     */
    async getMultipleChoiceLabel(multiple_choice) {
        return (await import("../Command/GetMultipleChoiceLabelCommand.mjs")).GetMultipleChoiceLabelCommand.new(
            this
        )
            .getMultipleChoiceLabel(
                multiple_choice
            );
    }

    /**
     * @param {Combination | null} combination
     * @returns {Promise<string>}
     */
    async getMultipleMandatoryLabel(combination = null) {
        return (await import("../Command/GetMultipleMandatoryLabelCommand.mjs")).GetMultipleMandatoryLabelCommand.new(
            this
        )
            .getMultipleMandatoryLabel(
                combination
            );
    }

    /**
     * @param {Place} place
     * @returns {Promise<string>}
     */
    async getPlaceLabel(place) {
        return (await import("../Command/GetPlaceLabelCommand.mjs")).GetPlaceLabelCommand.new(
            this
        )
            .getPlaceLabel(
                place
            );
    }

    /**
     * @param {Portrait} portrait
     * @returns {Promise<string>}
     */
    async getPhotoCriteriaLink(portrait) {
        return (await import("../Command/GetPhotoCriteriaLinkCommand.mjs")).GetPhotoCriteriaLinkCommand.new(
            this
        )
            .getPhotoCriteriaLink(
                portrait
            );
    }

    /**
     * @param {Qualification} qualification
     * @returns {Promise<string>}
     */
    async getQualificationLabel(qualification) {
        return (await import("../Command/GetQualificationLabelCommand.mjs")).GetQualificationLabelCommand.new(
            this
        )
            .getQualificationLabel(
                qualification
            );
    }

    /**
     * @param {Salutation} salutation
     * @returns {Promise<string>}
     */
    async getSalutationLabel(salutation) {
        return (await import("../Command/GetSalutationLabelCommand.mjs")).GetSalutationLabelCommand.new(
            this
        )
            .getSalutationLabel(
                salutation
            );
    }

    /**
     * @param {School} school
     * @returns {Promise<string>}
     */
    async getSchoolLabel(school) {
        return (await import("../Command/GetSchoolLabelCommand.mjs")).GetSchoolLabelCommand.new(
            this
        )
            .getSchoolLabel(
                school
            );
    }

    /**
     * @param {Semester} semester
     * @returns {Promise<string>}
     */
    async getSemesterLabel(semester) {
        return (await import("../Command/GetSemesterLabelCommand.mjs")).GetSemesterLabelCommand.new(
            this
        )
            .getSemesterLabel(
                semester
            );
    }

    /**
     * @param {SingleChoice} single_choice
     * @returns {Promise<string>}
     */
    async getSingleChoiceLabel(single_choice) {
        return (await import("../Command/GetSingleChoiceLabelCommand.mjs")).GetSingleChoiceLabelCommand.new(
            this
        )
            .getSingleChoiceLabel(
                single_choice
            );
    }

    /**
     * @param {Subject} subject
     * @returns {Promise<string>}
     */
    async getSubjectLabel(subject) {
        return (await import("../Command/GetSubjectLabelCommand.mjs")).GetSubjectLabelCommand.new(
            this.#flux_localization_api,
            this
        )
            .getSubjectLabel(
                subject
            );
    }
}
