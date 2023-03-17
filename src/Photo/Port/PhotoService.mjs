/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../../Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../../Photo/PhotoSize.mjs").PhotoSize} PhotoSize */
/** @typedef {import("../../Photo/PhotoWithType.mjs").PhotoWithType} PhotoWithType */

export class PhotoService {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {PhotoService}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number} max_width
     * @param {number} max_height
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    async createCtx(original_width, original_height, max_width, max_height) {
        return (await import("../Command/CreateCtxCommand.mjs")).CreateCtxCommand.new(
            this
        )
            .createCtx(
                original_width,
                original_height,
                max_width,
                max_height
            );
    }

    /**
     * @param {string} base64
     * @returns {Promise<Photo>}
     */
    async fromBase64(base64) {
        return (await import("../Command/FromBase64Command.mjs")).FromBase64Command.new(
            this
        )
            .fromBase64(
                base64
            );
    }

    /**
     * @param {string} binary
     * @returns {Promise<Photo>}
     */
    async fromBinary(binary) {
        return (await import("../Command/FromBinaryCommand.mjs")).FromBinaryCommand.new()
            .fromBinary(
                binary
            );
    }

    /**
     * @param {Blob} blob
     * @returns {Promise<Photo>}
     */
    async fromBlob(blob) {
        return (await import("../Command/FromBlobCommand.mjs")).FromBlobCommand.new()
            .fromBlob(
                blob
            );
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} type
     * @param {number} quality
     * @returns {Promise<Photo>}
     */
    async fromCtx(ctx, type, quality) {
        return (await import("../Command/FromCtxCommand.mjs")).FromCtxCommand.new(
            this
        )
            .fromCtx(
                ctx,
                type,
                quality
            );
    }

    /**
     * @param {HTMLInputElement} input_element
     * @returns {Promise<PhotoWithType | null>}
     */
    async fromInputElement(input_element) {
        return (await import("../Command/FromInputElementCommand.mjs")).FromInputElementCommand.new(
            this
        )
            .fromInputElement(
                input_element
            );
    }

    /**
     * @param {PhotoCrop} rectangle
     * @param {HTMLImageElement} image_element
     * @returns {Promise<PhotoCrop>}
     */
    async getCropFromRectangle(rectangle, image_element) {
        return (await import("../Command/GetCropFromRectangleCommand.mjs")).GetCropFromRectangleCommand.new()
            .getCropFromRectangle(
                rectangle,
                image_element
            );
    }

    /**
     * @param {HTMLElement} container_element
     * @param {MouseEvent | Touch} start
     * @param {MouseEvent | Touch} event
     * @returns {Promise<PhotoCrop | null>}
     */
    async getRectangleFromEvent(container_element, start, event) {
        return (await import("../Command/GetRectangleFromEventCommand.mjs")).GetRectangleFromEventCommand.new()
            .getRectangleFromEvent(
                container_element,
                start,
                event
            );
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
        return (await import("../Command/OptimizeCommand.mjs")).OptimizeCommand.new(
            this
        )
            .optimize(
                photo,
                photo_type,
                type,
                quality,
                max_width,
                max_height,
                grayscale,
                crop
            );
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number} max_width
     * @param {number} max_height
     * @returns {Promise<PhotoSize>}
     */
    async resize(original_width, original_height, max_width, max_height) {
        return (await import("../Command/ResizeCommand.mjs")).ResizeCommand.new()
            .resize(
                original_width,
                original_height,
                max_width,
                max_height
            );
    }

    /**
     * @param {Photo} photo
     * @returns {Promise<string>}
     */
    async toBase64(photo) {
        return (await import("../Command/ToBase64Command.mjs")).ToBase64Command.new(
            this
        )
            .toBase64(
                photo
            );
    }

    /**
     * @param {Photo} photo
     * @returns {Promise<string>}
     */
    async toBinary(photo) {
        return (await import("../Command/ToBinaryCommand.mjs")).ToBinaryCommand.new()
            .toBinary(
                photo
            );
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @returns {Promise<string>}
     */
    async toDataUrl(photo, type) {
        return (await import("../Command/ToDataUrlCommand.mjs")).ToDataUrlCommand.new(
            this
        )
            .toDataUrl(
                photo,
                type
            );
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @param {string | null} name
     * @returns {Promise<File>}
     */
    async toFile(photo, type, name = null) {
        return (await import("../Command/ToFileCommand.mjs")).ToFileCommand.new(
            this.#flux_localization_api
        )
            .toFile(
                photo,
                type,
                name
            );
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @returns {Promise<HTMLImageElement>}
     */
    async toImageElement(photo, type) {
        return (await import("../Command/ToImageElementCommand.mjs")).ToImageElementCommand.new(
            this
        )
            .toImageElement(
                photo,
                type
            );
    }

    /**
     * @param {Photo} photo
     * @param {HTMLInputElement} input_element
     * @param {string} type
     * @param {string | null} name
     * @returns {Promise<void>}
     */
    async toInputElement(photo, input_element, type, name = null) {
        return (await import("../Command/ToInputElementCommand.mjs")).ToInputElementCommand.new(
            this
        )
            .toInputElement(
                photo,
                input_element,
                type,
                name
            );
    }
}
