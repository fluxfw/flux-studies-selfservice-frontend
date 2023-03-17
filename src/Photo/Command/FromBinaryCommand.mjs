/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */

export class FromBinaryCommand {
    /**
     * @returns {FromBinaryCommand}
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
     * @param {string} binary
     * @returns {Promise<Photo>}
     */
    async fromBinary(binary) {
        return binary.split("").map(char => char.charCodeAt(0));
    }
}
