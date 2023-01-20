/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */

export class ToBinaryCommand {
    /**
     * @returns {ToBinaryCommand}
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
     * @param {Photo} photo
     * @returns {Promise<string>}
     */
    async toBinary(photo) {
        return photo.map(char => String.fromCharCode(char)).join("");
    }
}
