/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/Combination/MultipleChoice.mjs").MultipleChoice} MultipleChoice */

export class GetMultipleChoiceLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetMultipleChoiceLabelCommand}
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
     * @param {MultipleChoice} multiple_choice
     * @returns {Promise<string>}
     */
    async getMultipleChoiceLabel(multiple_choice) {
        return this.#label_service.getSingleChoiceLabel(
            multiple_choice
        );
    }
}
