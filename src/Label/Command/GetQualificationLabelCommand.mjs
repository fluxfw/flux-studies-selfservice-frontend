/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Qualification/Qualification.mjs").Qualification} Qualification */

export class GetQualificationLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetQualificationLabelCommand}
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
     * @param {Qualification} qualification
     * @returns {Promise<string>}
     */
    async getQualificationLabel(qualification) {
        return await this.#label_service.getLabel(
            qualification.label
        ) ?? qualification.id ?? "";
    }
}
