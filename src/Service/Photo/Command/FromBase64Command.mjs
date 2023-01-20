/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class FromBase64Command {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {FromBase64Command}
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
     * @param {string} base64
     * @returns {Promise<Photo>}
     */
    async fromBase64(base64) {
        return atob(await this.#photo_service.fromBinary(
            base64
        ));
    }
}
