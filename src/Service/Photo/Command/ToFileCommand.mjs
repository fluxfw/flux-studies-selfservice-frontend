/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */

export class ToFileCommand {
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LocalizationApi} localization_api
     * @returns {ToFileCommand}
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
     * @param {Photo} photo
     * @param {string} type
     * @param {string | null} name
     * @returns {Promise<File>}
     */
    async toFile(photo, type, name = null) {
        return new File([
            new Uint8Array(photo).buffer
        ], name ?? `${await this.#localization_api.translate(
            "Photo"
        )}.${type.split("/")[1]}`, {
            type
        });
    }
}
