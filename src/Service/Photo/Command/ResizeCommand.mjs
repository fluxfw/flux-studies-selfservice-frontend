/** @typedef {import("../../../Adapter/Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../../../Adapter/Photo/PhotoSize.mjs").PhotoSize} PhotoSize */

export class ResizeCommand {
    /**
     * @returns {ResizeCommand}
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
     * @param {number} original_width
     * @param {number} original_height
     * @param {number} max_width
     * @param {number} max_height
     * @returns {Promise<PhotoSize>}
     */
    async resize(original_width, original_height, max_width, max_height) {
        const ratio = original_width / original_height;

        let width, height;
        if (ratio >= 1) {
            width = max_width > original_width ? original_width : max_width;
            height = width / ratio;
        } else {
            height = max_height > original_height ? original_height : max_height;
            width = height * ratio;
        }

        return {
            width,
            height
        };
    }
}
