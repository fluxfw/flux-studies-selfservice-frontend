/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */

export class FromBlobCommand {
    /**
     * @returns {FromBlobCommand}
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
     * @param {Blob} blob
     * @returns {Promise<Photo>}
     */
    async fromBlob(blob) {
        return Array.from(new Uint8Array(await blob.arrayBuffer()));
    }
}
