/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

export class GetEctLabelCommand {
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LocalizationApi} localization_api
     * @returns {GetEctLabelCommand}
     */
    static new(localization_api) {
        return new this(
            localization_api
        );
    }

    /**
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(localization_api) {
        this.#localization_api = localization_api;
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

        return this.#localization_api.translate(
            "{ect} ECT",
            null,
            {
                ect: _ect
            }
        );
    }
}
