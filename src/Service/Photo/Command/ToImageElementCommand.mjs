/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class ToImageElementCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {ToImageElementCommand}
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
     * @returns {Promise<HTMLImageElement>}
     */
    async toImageElement(photo, type) {
        const src = await this.#photo_service.toDataUrl(
            photo,
            type
        );

        return new Promise((resolve, reject) => {
            const image_element = new Image();

            image_element.addEventListener("load", () => {
                resolve(image_element);
            });

            image_element.addEventListener("error", e => {
                reject(e);
            });

            image_element.src = src;
        });
    }
}
