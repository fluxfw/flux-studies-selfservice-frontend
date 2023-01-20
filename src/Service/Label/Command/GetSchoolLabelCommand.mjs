/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/School/School.mjs").School} School */

export class GetSchoolLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetSchoolLabelCommand}
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
     * @param {School} school
     * @returns {Promise<string>}
     */
    async getSchoolLabel(school) {
        return await this.#label_service.getLabel(
            school.label
        ) ?? school.id ?? "";
    }
}
