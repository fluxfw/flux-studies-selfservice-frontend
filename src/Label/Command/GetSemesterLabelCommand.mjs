/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Semester/Semester.mjs").Semester} Semester */

export class GetSemesterLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetSemesterLabelCommand}
     */
    static new(label_service) {
        return new this(
            label_service
        );
    }

    /**
     * @param {LabelService} label_service
     * @private
     */
    constructor(label_service) {
        this.#label_service = label_service;
    }

    /**
     * @param {Semester} semester
     * @returns {Promise<string>}
     */
    async getSemesterLabel(semester) {
        return await this.#label_service.getLabel(
            semester.label
        ) ?? semester.id ?? "";
    }
}
