/** @typedef {import("../../../Adapter/Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

export class GetCombinationLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @returns {GetCombinationLabelCommand}
     */
    static new(label_service, localization_api) {
        return new this(
            label_service,
            localization_api
        );
    }

    /**
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(label_service, localization_api) {
        this.#label_service = label_service;
        this.#localization_api = localization_api;
    }

    /**
     * @param {Combination} combination
     * @returns {Promise<string>}
     */
    async getCombinationLabel(combination) {
        return this.#localization_api.translate(
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
