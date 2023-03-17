/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class ToDataUrlCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {ToDataUrlCommand}
     */
    static new(photo_service) {
        return new this(
            photo_service
        );
    }

    /**
     * @param {PhotoService} photo_service
     * @private
     */
    constructor(photo_service) {
        this.#photo_service = photo_service;
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @returns {Promise<string>}
     */
    async toDataUrl(photo, type) {
        return `data:${type};base64,${await this.#photo_service.toBase64(
            photo
        )}`;
    }
}
