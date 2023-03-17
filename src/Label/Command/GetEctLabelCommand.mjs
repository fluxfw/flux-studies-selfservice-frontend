/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

export class GetEctLabelCommand {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {GetEctLabelCommand}
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
     * @param {number | number[]} ect
     * @returns {Promise<string>}
     */
    async getEctLabel(ect) {
        let _ect;
        if (Array.isArray(ect)) {
            _ect = ect.join(", ");
        } else {
            _ect = ect;
        }

        return this.#flux_localization_api.translate(
            "{ect} ECT",
            null,
            {
                ect: _ect
            }
        );
    }
}
