/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../Label/Label.mjs").Label} Label */

export class GetLabelCommand {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {GetLabelCommand}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {Label} label
     * @returns {Promise<string | null>}
     */
    async getLabel(label) {
        return typeof label === "string" ? label : label[(await this.#flux_localization_api.getLanguage()).language] ?? label.en ?? Object.values(label)[0] ?? null;
    }
}
