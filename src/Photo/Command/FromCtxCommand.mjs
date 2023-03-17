/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class FromCtxCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {FromCtxCommand}
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
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} type
     * @param {number} quality
     * @returns {Promise<Photo>}
     */
    async fromCtx(ctx, type, quality) {
        return this.#photo_service.fromBlob(
            await new Promise(resolve => ctx.canvas.toBlob(resolve, type, quality))
        );
    }
}
