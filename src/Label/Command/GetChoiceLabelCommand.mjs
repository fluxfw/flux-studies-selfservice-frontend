/** @typedef {import("../../Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetChoiceLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetChoiceLabelCommand}
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
     * @param {Choice} choice
     * @returns {Promise<string>}
     */
    async getChoiceLabel(choice) {
        return this.#label_service.getSubjectLabel(
            choice
        );
    }
}
