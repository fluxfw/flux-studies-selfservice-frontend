/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class ToBase64Command {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {ToBase64Command}
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
     * @returns {Promise<string>}
     */
    async toBase64(photo) {
        return btoa(await this.#photo_service.toBinary(
            photo
        ));
    }
}
