/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class ToInputElementCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {ToInputElementCommand}
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
     * @param {HTMLInputElement} input_element
     * @param {string} type
     * @param {string | null} name
     * @returns {Promise<void>}
     */
    async toInputElement(photo, input_element, type, name = null) {
        const data_transfer = new DataTransfer();
        data_transfer.items.add(await this.#photo_service.toFile(
            photo,
            type,
            name
        ));
        input_element.files = data_transfer.files;
    }
}
