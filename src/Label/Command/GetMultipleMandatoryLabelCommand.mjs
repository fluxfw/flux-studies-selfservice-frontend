/** @typedef {import("../../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetMultipleMandatoryLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetMultipleMandatoryLabelCommand}
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
     * @param {Combination | null} combination
     * @returns {Promise<string>}
     */
    async getMultipleMandatoryLabel(combination = null) {
        if ((combination?.mandatory ?? null) === null) {
            return "-";
        }

        return (await Promise.all(combination.mandatory.map(async mandatory => this.#label_service.getMandatoryLabel(
            mandatory
        )))).join("\n");
    }
}
