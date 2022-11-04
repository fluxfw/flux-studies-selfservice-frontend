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
     * @param {number} max_width
     * @param {number} max_height
     * @returns {CanvasRenderingContext2D}
     */
    createCtx(original_width, original_height, max_width, max_height) {
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
     * @param {string} type
     * @param {number} quality
     * @returns {Promise<Photo>}
     */
    async fromCtx(ctx, type, quality) {
        return this.fromBlob(
            await new Promise(resolve => ctx.canvas.toBlob(resolve, type, quality))
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
     * @param {PhotoCrop} rectangle
     * @param {HTMLImageElement} image_element
     * @returns {PhotoCrop}
     */
    getCropFromRectangle(rectangle, image_element) {
        return {
            x: Math.floor(rectangle.x * image_element.naturalWidth / 100),
            y: Math.floor(rectangle.y * image_element.naturalHeight / 100),
            width: Math.ceil(rectangle.width * image_element.naturalWidth / 100),
            height: Math.ceil(rectangle.height * image_element.naturalHeight / 100)
        };
    }

    /**
     * @param {HTMLElement} container_element
     * @param {MouseEvent | Touch} start
     * @param {MouseEvent | Touch} event
     * @returns {PhotoCrop | null}
     */
    getRectangleFromEvent(container_element, start, event) {
        const container_rectangle = container_element.getClientRects()[0] ?? null;

        if (container_rectangle === null) {
            return null;
        }

        if (start.clientX < container_rectangle.left || start.clientX > container_rectangle.right) {
            return null;
        }
        if (start.clientY < container_rectangle.top || start.clientY > container_rectangle.bottom) {
            return null;
        }

        const startClientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, start.clientX > event.clientX ? event.clientX : start.clientX));
        const clientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, start.clientX < event.clientX ? event.clientX : start.clientX));

        const startClientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, start.clientY > event.clientY ? event.clientY : start.clientY));
        const clientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, start.clientY < event.clientY ? event.clientY : start.clientY));

        const x = Math.max(0, startClientX - container_rectangle.left);
        const y = Math.max(0, startClientY - container_rectangle.top);
        const width = Math.min(container_rectangle.width - x, Math.max(0, clientX - startClientX));
        const height = Math.min(container_rectangle.height - y, Math.max(0, clientY - startClientY));

        if (width === 0 && height === 0) {
            return null;
        }

        return {
            x: x * 100 / container_rectangle.width,
            y: y * 100 / container_rectangle.height,
            width: width * 100 / container_rectangle.width,
            height: height * 100 / container_rectangle.height
        };
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

        const ctx = this.createCtx(
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

        return this.fromCtx(
            ctx,
            type,
            quality
        );
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number} max_width
     * @param {number} max_height
     * @returns {PhotoSize}
     */
    resize(original_width, original_height, max_width, max_height) {
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
     * @param {string} type
     * @returns {string}
     */
    toDataUrl(photo, type) {
        return `data:${type};base64,${this.toBase64(
            photo
        )}`;
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @param {string | null} name
     * @returns {File}
     */
    toFile(photo, type, name = null) {
        return new File([
            new Uint8Array(photo).buffer
        ], name ?? `${this.#localization_api.translate(
            "Photo"
        )}.${type.split("/")[1]}`, {
            type
        });
    }

    /**
     * @param {Photo} photo
     * @param {string} type
     * @returns {Promise<HTMLImageElement>}
     */
    async toImageElement(photo, type) {
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
     * @param {string} type
     * @param {string | null} name
     * @returns {void}
     */
    toInputElement(photo, input_element, type, name = null) {
        const data_transfer = new DataTransfer();
        data_transfer.items.add(this.toFile(
            photo,
            type,
            name
        ));
        input_element.files = data_transfer.files;
    }
}
