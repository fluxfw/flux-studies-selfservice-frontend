/** @typedef {import("../../../Adapter/Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */

export class GetCropFromRectangleCommand {
    /**
     * @returns {GetCropFromRectangleCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {PhotoCrop} rectangle
     * @param {HTMLImageElement} image_element
     * @returns {Promise<PhotoCrop>}
     */
    async getCropFromRectangle(rectangle, image_element) {
        return {
            x: Math.floor(rectangle.x * image_element.naturalWidth / 100),
            y: Math.floor(rectangle.y * image_element.naturalHeight / 100),
            width: Math.ceil(rectangle.width * image_element.naturalWidth / 100),
            height: Math.ceil(rectangle.height * image_element.naturalHeight / 100)
        };
    }
}
