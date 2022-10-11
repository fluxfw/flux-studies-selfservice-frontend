/** @typedef {import("../../../Adapter/Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../../Adapter/DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Combination/Mandatory.mjs").Mandatory} Mandatory */
/** @typedef {import("../../../Adapter/Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */
/** @typedef {import("../../../Adapter/Qualification/Qualification.mjs").Qualification} Qualification */
/** @typedef {import("../../../Adapter/Combination/SingleChoice.mjs").SingleChoice} SingleChoice */
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
     * @param {Choice} choice
     * @returns {string}
     */
    getChoiceLabel(choice) {
        return this.getSubjectLabel(
            choice
        );
    }

    /**
     * @param {Combination} combination
     * @returns {string}
     */
    getCombinationLabel(combination) {
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
                label: this.#localization_api.translate(
                    combination.label
                )
            }
        );
    }

    /**
     * @param {DegreeProgram} degree_program
     * @returns {string}
     */
    getDegreeProgramLabel(degree_program) {
        return this.#localization_api.translate(
            degree_program.label
        );
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
     * @param {Mandatory} mandatory
     * @returns {string}
     */
    getMandatoryLabel(mandatory) {
        return this.getSubjectLabel(
            mandatory
        );
    }

    /**
     * @param {MultipleChoice} multiple_choice
     * @returns {string}
     */
    getMultipleChoiceLabel(multiple_choice) {
        return this.getSingleChoiceLabel(
            multiple_choice
        );
    }

    /**
     * @param {Combination | null} combination
     * @returns {string}
     */
    getMultipleMandatoryLabel(combination = null) {
        return combination?.mandatory?.map(mandatory => this.getMandatoryLabel(
            mandatory
        ))?.join("\n") ?? "-";
    }

    /**
     * @param {Qualification} qualification
     * @returns {string}
     */
    getQualificationLabel(qualification) {
        return this.#localization_api.translate(
            qualification.label
        );
    }

    /**
     * @param {Semester} semester
     * @returns {string}
     */
    getSemesterLabel(semester) {
        return this.#localization_api.translate(
            semester.label
        );
    }

    /**
     * @param {SingleChoice} single_choice
     * @returns {string}
     */
    getSingleChoiceLabel(single_choice) {
        return this.getSubjectLabel(
            single_choice
        );
    }

    /**
     * @param {Subject} subject
     * @returns {string}
     */
    getSubjectLabel(subject) {
        return this.#localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: this.getEctLabel(
                    subject.ect
                ),
                label: this.#localization_api.translate(
                    subject.label
                )
            }
        );
    }
}
