/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class CreateCtxCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {CreateCtxCommand}
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
     * @param {number} original_width
     * @param {number} original_height
     * @param {number} max_width
     * @param {number} max_height
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    async createCtx(original_width, original_height, max_width, max_height) {
        const size = await this.#photo_service.resize(
            original_width,
            original_height,
            max_width,
            max_height
        );

        const ctx = document.createElement("canvas").getContext("2d");

        ctx.canvas.width = size.width;
        ctx.canvas.height = size.height;

        return ctx;
    }
}
