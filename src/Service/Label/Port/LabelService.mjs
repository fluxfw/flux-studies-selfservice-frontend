/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
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
     * @param {Combination} combination
     * @returns {string}
     */
    getCombinationLabel(combination) {
        return `${combination.label}${this.getEctLabel(
            [
                ...combination.mandatory?.map(mandatory => mandatory.ect) ?? []
            ]
        )}`;
    }

    /**
     * @param {number | number[]} ect
     * @returns {string}
     */
    getEctLabel(ect) {
        return ` (${Array.isArray(ect) ? ect.join(", ") : ect} ECT)`;
    }

    /**
     * @param {Combination | null} combination
     * @returns {string}
     */
    getMultipleMandatoryLabel(combination = null) {
        return combination?.mandatory?.map(mandatory => this.getSubjectLabel(
            mandatory
        ))?.join("\n") ?? "";
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
