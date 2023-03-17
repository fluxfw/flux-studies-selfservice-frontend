/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Portrait/Portrait.mjs").Portrait} Portrait */

export class GetPhotoCriteriaLinkCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetPhotoCriteriaLinkCommand}
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
     * @param {Portrait} portrait
     * @returns {Promise<string>}
     */
    async getPhotoCriteriaLink(portrait) {
        return await this.#label_service.getLabel(
            portrait["photo-criteria-links"]
        ) ?? "";
    }
}
