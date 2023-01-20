/** @typedef {import("../../../Adapter/DegreeTitle/DegreeTitle.mjs").DegreeTitle} DegreeTitle */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetDegreeTitleLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetDegreeTitleLabelCommand}
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
     * @param {DegreeTitle} degree_title
     * @returns {Promise<string>}
     */
    async getDegreeTitleLabel(degree_title) {
        return await this.#label_service.getLabel(
            degree_title.label
        ) ?? degree_title.id ?? "";
    }
}
