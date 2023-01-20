/** @typedef {import("../../../Adapter/Label/Label.mjs").Label} Label */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetErrorMessageLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetErrorMessageLabelCommand}
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
     * @param {Label} error_message
     * @returns {Promise<string>}
     */
    async getErrorMessageLabel(error_message) {
        return await this.#label_service.getLabel(
            error_message
        ) ?? "";
    }
}
