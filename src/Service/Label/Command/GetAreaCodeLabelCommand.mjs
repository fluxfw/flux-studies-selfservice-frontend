/** @typedef {import("../../../Adapter/AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetAreaCodeLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetAreaCodeLabelCommand}
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
     * @param {AreaCode} area_code
     * @returns {Promise<string>}
     */
    async getAreaCodeLabel(area_code) {
        return await this.#label_service.getLabel(
            area_code.label
        ) ?? area_code.id ?? "";
    }
}
