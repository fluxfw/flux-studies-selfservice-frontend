/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/Combination/SingleChoice.mjs").SingleChoice} SingleChoice */

export class GetSingleChoiceLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetSingleChoiceLabelCommand}
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
     * @param {SingleChoice} single_choice
     * @returns {Promise<string>}
     */
    async getSingleChoiceLabel(single_choice) {
        return this.#label_service.getSubjectLabel(
            single_choice
        );
    }
}
