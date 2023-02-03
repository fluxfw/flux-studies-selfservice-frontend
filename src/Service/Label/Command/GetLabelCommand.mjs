/** @typedef {import("../../../Adapter/Label/Label.mjs").Label} Label */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

export class GetLabelCommand {
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LocalizationApi} localization_api
     * @returns {GetLabelCommand}
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
     * @param {Label} label
     * @returns {Promise<string | null>}
     */
    async getLabel(label) {
        return typeof label === "string" ? label : label[(await this.#localization_api.getLanguage()).language] ?? label.en ?? Object.values(label)[0] ?? null;
    }
}
