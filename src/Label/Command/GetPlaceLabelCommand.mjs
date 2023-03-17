/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Place/Place.mjs").Place} Place */

export class GetPlaceLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetPlaceLabelCommand}
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
     * @param {Place} place
     * @returns {Promise<string>}
     */
    async getPlaceLabel(place) {
        return await this.#label_service.getLabel(
            place.label
        ) ?? place.id ?? "";
    }
}
