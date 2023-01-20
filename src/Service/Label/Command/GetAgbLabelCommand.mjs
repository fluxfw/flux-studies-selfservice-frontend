/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/Legal/Legal.mjs").Legal} Legal */

export class GetAgbLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetAgbLabelCommand}
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
     * @param {Legal} legal
     * @returns {Promise<string>}
     */
    async getAgbLabel(legal) {
        return await this.#label_service.getLabel(
            legal["agb-label"]
        ) ?? "";
    }
}
