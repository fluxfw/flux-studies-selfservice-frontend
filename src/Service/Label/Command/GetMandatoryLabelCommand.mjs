/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Adapter/Combination/Mandatory.mjs").Mandatory} Mandatory */

export class GetMandatoryLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetMandatoryLabelCommand}
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
     * @param {Mandatory} mandatory
     * @returns {Promise<string>}
     */
    async getMandatoryLabel(mandatory) {
        return this.#label_service.getSubjectLabel(
            mandatory
        );
    }
}
