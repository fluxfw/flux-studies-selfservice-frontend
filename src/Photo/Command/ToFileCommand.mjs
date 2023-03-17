/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */

export class ToFileCommand {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {ToFileCommand}
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
     * @param {Photo} photo
     * @param {string} type
     * @param {string | null} name
     * @returns {Promise<File>}
     */
    async toFile(photo, type, name = null) {
        return new File([
            new Uint8Array(photo).buffer
        ], name ?? `${await this.#flux_localization_api.translate(
            "Photo"
        )}.${type.split("/")[1]}`, {
            type
        });
    }
}
