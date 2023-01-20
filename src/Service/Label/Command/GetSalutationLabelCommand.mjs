/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/Salutation/Salutation.mjs").Salutation} Salutation */

export class GetSalutationLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetSalutationLabelCommand}
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
     * @param {Salutation} salutation
     * @returns {Promise<string>}
     */
    async getSalutationLabel(salutation) {
        return await this.#label_service.getLabel(
            salutation.label
        ) ?? salutation.id ?? "";
    }
}
