/** @typedef {import("../../../Adapter/Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../../Adapter/Combination/Mandatory.mjs").Mandatory} Mandatory */
/** @typedef {import("../../../Adapter/Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */
/** @typedef {import("../../../Adapter/Combination/SingleChoice.mjs").SingleChoice} SingleChoice */
/** @typedef {import("../../../Adapter/Subject/Subject.mjs").Subject} Subject */

export class LabelService {
    /**
     * @returns {LabelService}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

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
        return `${combination.label}${this.getEctLabel(
            [
                ...combination.mandatory?.map(mandatory => mandatory.ect) ?? [],
                ...combination["single-choice"]?.map(single_choice => single_choice.ect) ?? [],
                ...combination["multiple-choice"]?.map(multiple_choice => multiple_choice.ect) ?? []
            ]
        )}`;
    }

    /**
     * @param {number | number[]} ect
     * @param {boolean} clamps
     * @returns {string}
     */
    getEctLabel(ect, clamps = true) {
        let _ect;
        if (Array.isArray(ect)) {
            _ect = ect.join(", ");
        } else {
            _ect = ect;
        }

        if (!clamps) {
            return ` ${_ect} ECT`;
        }

        return ` (${_ect} ECT)`;
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
        return `${subject.label}${this.getEctLabel(
            subject.ect
        )}`;
    }
}
