/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../../../Adapter/Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../Port/PhotoService.mjs").PhotoService} PhotoService */

export class OptimizeCommand {
    /**
     * @type {PhotoService}
     */
    #photo_service;

    /**
     * @param {PhotoService} photo_service
     * @returns {OptimizeCommand}
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
     * @param {string} photo_type
     * @param {string} type
     * @param {number} quality
     * @param {number} max_width
     * @param {number} max_height
     * @param {boolean} grayscale
     * @param {PhotoCrop | null} crop
     * @returns {Promise<Photo>}
     */
    async optimize(photo, photo_type, type, quality, max_width, max_height, grayscale, crop = null) {
        const image_element = await this.#photo_service.toImageElement(
            photo,
            photo_type
        );

        if (crop !== null) {
            const crop_ctx = await this.#photo_service.createCtx(
                image_element.naturalWidth,
                image_element.naturalHeight,
                crop.width,
                crop.height
            );

            crop_ctx.canvas.width = crop.width;
            crop_ctx.canvas.height = crop.height;

            crop_ctx.drawImage(image_element, crop.x, crop.y, crop.width, crop.height, 0, 0, crop_ctx.canvas.width, crop_ctx.canvas.height);

            return this.#photo_service.optimize(
                await this.#photo_service.fromCtx(
                    crop_ctx,
                    type,
                    quality
                ),
                type,
                type,
                quality,
                max_width,
                max_height,
                grayscale
            );
        }

        const ctx = await this.#photo_service.createCtx(
            image_element.naturalWidth,
            image_element.naturalHeight,
            max_width,
            max_height
        );

        if (grayscale && "filter" in ctx) {
            ctx.filter = "grayscale(1)";
        }

        ctx.drawImage(image_element, 0, 0, image_element.naturalWidth, image_element.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);

        if (grayscale && !("filter" in ctx)) {
            // https://stackoverflow.com/questions/53364140/how-can-i-grayscale-a-canvas-image-in-javascript#answer-53365073
            const image_data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (let i = 0; i < image_data.data.length; i += 4) {
                const lightness = parseInt((image_data.data[i] + image_data.data[i + 1] + image_data.data[i + 2]) / 3);
                image_data.data[i] = lightness;
                image_data.data[i + 1] = lightness;
                image_data.data[i + 2] = lightness;
            }
            ctx.putImageData(image_data, 0, 0);
        }

        return this.#photo_service.fromCtx(
            ctx,
            type,
            quality
        );
    }
}
