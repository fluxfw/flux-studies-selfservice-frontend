import { PHOTO_TYPE_WEBP } from "../../../Adapter/Photo/PhotoType.mjs";

/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../../../Adapter/Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../../../Adapter/Photo/PhotoSize.mjs").PhotoSize} PhotoSize */
/** @typedef {import("../../../Adapter/Photo/PhotoWithType.mjs").PhotoWithType} PhotoWithType */

export class PhotoService {
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LocalizationApi} localization_api
     * @returns {PhotoService}
     */
    static new(localization_api) {
        return new this(
            localization_api
        );
    }

    /**
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(localization_api) {
        this.#localization_api = localization_api;
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number | null} max_width
     * @param {number | null} max_height
     * @returns {CanvasRenderingContext2D}
     */
    createCtx(original_width, original_height, max_width = null, max_height = null) {
        const size = this.resize(
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

    /**
     * @param {string} base64
     * @returns {Photo}
     */
    fromBase64(base64) {
        return atob(this.fromBinary(
            base64
        ));
    }

    /**
     * @param {string} binary
     * @returns {Photo}
     */
    fromBinary(binary) {
        return binary.split("").map(char => char.charCodeAt(0));
    }

    /**
     * @param {Blob} blob
     * @returns {Promise<Photo>}
     */
    async fromBlob(blob) {
        return Array.from(new Uint8Array(await blob.arrayBuffer()));
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {string | null} type
     * @param {number | null} quality
     * @returns {Promise<Photo>}
     */
    async fromCtx(ctx, type = null, quality = null) {
        return this.fromBlob(
            await new Promise(resolve => ctx.canvas.toBlob(resolve, type ?? PHOTO_TYPE_WEBP, quality ?? 0.5))
        );
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
            photo: await this.fromBlob(
                file
            ),
            type: file.type
        };
    }

    /**
     * @param {Photo} photo
     * @param {string | null} photo_type
     * @param {PhotoCrop | null} crop
     * @param {number | null} max_width
     * @param {number | null} max_height
     * @param {boolean | null} grayscale
     * @param {string | null} type
     * @param {number | null} quality
     * @returns {Promise<Photo>}
     */
    async optimize(photo, photo_type = null, crop = null, max_width = null, max_height = null, grayscale = null, type = null, quality = null) {
        const image_element = await this.toImageElement(
            photo,
            photo_type
        );

        if (crop !== null) {
            const crop_ctx = this.createCtx(
                image_element.naturalWidth,
                image_element.naturalHeight,
                crop.width,
                crop.height
            );

            crop_ctx.canvas.width = crop.width;
            crop_ctx.canvas.height = crop.height;

            crop_ctx.drawImage(image_element, crop.x, crop.y, crop.width, crop.height, 0, 0, crop_ctx.canvas.width, crop_ctx.canvas.height);

            return this.optimize(
                await this.fromCtx(
                    crop_ctx,
                    null,
                    1
                ),
                null,
                null,
                max_width,
                max_height,
                grayscale,
                type,
                quality
            );
        }

        const ctx = this.createCtx(
            image_element.naturalWidth,
            image_element.naturalHeight,
            max_width,
            max_height
        );

        const _grayscale = grayscale ?? true;
        if (_grayscale && "filter" in ctx) {
            ctx.filter = "grayscale(1)";
        }

        ctx.drawImage(image_element, 0, 0, image_element.naturalWidth, image_element.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);

        if (_grayscale && !("filter" in ctx)) {
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

        return this.fromCtx(
            ctx,
            type,
            quality
        );
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number | null} max_width
     * @param {number | null} max_height
     * @returns {PhotoSize}
     */
    resize(original_width, original_height, max_width = null, max_height = null) {
        const _max_width = max_width ?? 200;
        const _max_height = max_height ?? 200;

        const ratio = original_width / original_height;

        let width, height;
        if (ratio >= 1) {
            width = _max_width > original_width ? original_width : _max_width;
            height = width / ratio;
        } else {
            height = _max_height > original_height ? original_height : _max_height;
            width = height * ratio;
        }

        return {
            width,
            height
        };
    }

    /**
     * @param {Photo} photo
     * @returns {string}
     */
    toBase64(photo) {
        return btoa(this.toBinary(
            photo
        ));
    }

    /**
     * @param {Photo} photo
     * @returns {string}
     */
    toBinary(photo) {
        return photo.map(char => String.fromCharCode(char)).join("");
    }

    /**
     * @param {Photo} photo
     * @param {string | null} type
     * @returns {string}
     */
    toDataUrl(photo, type = null) {
        return `data:${type ?? PHOTO_TYPE_WEBP};base64,${this.toBase64(
            photo
        )}`;
    }

    /**
     * @param {Photo} photo
     * @param {string | null} name
     * @param {string | null} type
     * @returns {File}
     */
    toFile(photo, name = null, type = null) {
        const _type = type ?? PHOTO_TYPE_WEBP;

        return new File([
            new Uint8Array(photo).buffer
        ], name ?? `${this.#localization_api.translate(
            "Photo"
        )}.${_type.split("/")[1]}`, {
            type: _type
        });
    }

    /**
     * @param {Photo} photo
     * @param {string | null} type
     * @returns {Promise<HTMLImageElement>}
     */
    async toImageElement(photo, type = null) {
        return new Promise((resolve, reject) => {
            const image_element = new Image();

            image_element.addEventListener("load", () => {
                resolve(image_element);
            });

            image_element.addEventListener("error", e => {
                reject(e);
            });

            image_element.src = this.toDataUrl(
                photo,
                type
            );
        });
    }

    /**
     * @param {Photo} photo
     * @param {HTMLInputElement} input_element
     * @param {string | null} name
     * @param {string | null} type
     * @returns {void}
     */
    toInputElement(photo, input_element, name = null, type = null) {
        const data_transfer = new DataTransfer();
        data_transfer.items.add(this.toFile(
            photo,
            name,
            type
        ));
        input_element.files = data_transfer.files;
    }
}
