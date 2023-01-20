/** @typedef {import("../../../Adapter/Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetCantonLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetCantonLabelCommand}
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
     * @param {Canton} canton
     * @returns {Promise<string>}
     */
    async getCantonLabel(canton) {
        return await this.#label_service.getLabel(
            canton.label
        ) ?? canton.id ?? "";
    }
}
