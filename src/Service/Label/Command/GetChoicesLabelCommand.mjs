/** @typedef {import("../../../Adapter/Combination/Choice.mjs").Choice} Choice */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetChoicesLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetChoicesLabelCommand}
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
     * @param {Choice[]} choices
     * @returns {Promise<string>}
     */
    async getChoicesLabel(choices) {
        return (await Promise.all(choices.map(async choice => this.#label_service.getChoiceLabel(
            choice
        )))).join("\n");
    }
}
