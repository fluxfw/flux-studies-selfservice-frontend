/** @typedef {import("../../../Adapter/Country/Country.mjs").Country} Country */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetCountryLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetCountryLabelCommand}
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
     * @param {Country} country
     * @returns {Promise<string>}
     */
    async getCountryLabel(country) {
        return await this.#label_service.getLabel(
            country.label
        ) ?? country.id ?? "";
    }
}
