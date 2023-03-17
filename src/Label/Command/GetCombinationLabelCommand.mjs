/** @typedef {import("../../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetCombinationLabelCommand {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @returns {GetCombinationLabelCommand}
     */
    static new(flux_localization_api, label_service) {
        return new this(
            flux_localization_api,
            label_service
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @private
     */
    constructor(flux_localization_api, label_service) {
        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
    }

    /**
     * @param {Combination} combination
     * @returns {Promise<string>}
     */
    async getCombinationLabel(combination) {
        return this.#flux_localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: await this.#label_service.getEctLabel(
                    [
                        ...combination.mandatory?.map(mandatory => mandatory.ect) ?? [],
                        ...combination["single-choice"]?.map(single_choice => single_choice.ect) ?? [],
                        ...combination["multiple-choice"]?.map(multiple_choice => multiple_choice.ect) ?? []
                    ]
                ),
                label: await this.#label_service.getLabel(
                    combination.label
                ) ?? combination.id ?? ""
            }
        );
    }
}
