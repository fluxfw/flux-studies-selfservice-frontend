/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */
/** @typedef {import("../../Photo/PhotoWithType.mjs").PhotoWithType} PhotoWithType */

export class FromInputElementCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {FromInputElementCommand}
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
     * @param {HTMLInputElement} input_element
     * @returns {Promise<PhotoWithType | null>}
     */
    async fromInputElement(input_element) {
        if (input_element.files.length === 0) {
            return null;
        }

        const [
            file
        ] = input_element.files;

        return {
            photo: await this.#photo_service.fromBlob(
                file
            ),
            type: file.type
        };
    }
}
