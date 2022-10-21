import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PORTRAIT } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenPortraitFunction.mjs").chosenPortraitFunction} chosenPortraitFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./getLoadingElement.mjs").getLoadingElement} getLoadingElement */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("./Portrait.mjs").Portrait} Portrait */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PortraitElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenPortraitFunction}
     */
    #chosen_portrait_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {getLoadingElement}
     */
    #get_loading_element;
    /**
     * @type {HTMLImageElement}
     */
    #image_element;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {Photo | null}
     */
    #photo = null;
    /**
     * @type {Portrait}
     */
    #portrait;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {getLoadingElement} get_loading_element
     * @param {LocalizationApi} localization_api
     * @param {Portrait} portrait
     * @param {chosenPortraitFunction} chosen_portrait
     * @param {backFunction | null} back_function
     * @returns {PortraitElement}
     */
    static new(css_api, get_loading_element, localization_api, portrait, chosen_portrait, back_function = null) {
        return new this(
            css_api,
            get_loading_element,
            localization_api,
            portrait,
            chosen_portrait,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {getLoadingElement} get_loading_element
     * @param {LocalizationApi} localization_api
     * @param {Portrait} portrait
     * @param {chosenPortraitFunction} chosen_portrait
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, get_loading_element, localization_api, portrait, chosen_portrait, back_function) {
        super();

        this.#css_api = css_api;
        this.#get_loading_element = get_loading_element;
        this.#localization_api = localization_api;
        this.#portrait = portrait;
        this.#chosen_portrait_function = chosen_portrait;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {Blob} blob
     * @returns {Promise<Photo>}
     */
    async #blobToPhoto(blob) {
        return [
            ...new Uint8Array(await blob.arrayBuffer())
        ];
    }

    /**
     * @returns {Promise<void>}
     */
    async #chosenPortrait() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_portrait_function(
            {
                photo: this.#photo
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#form_element.addInvalidMessage(
            this.#localization_api.translate(
                "Please check your data!"
            )
        );
    }

    /**
     * @param {number} original_width
     * @param {number} original_height
     * @param {number | null} max_width
     * @param {number | null} max_height
     * @returns {CanvasRenderingContext2D}
     */
    #createCtx(original_width, original_height, max_width = null, max_height = null) {
        const _max_width = max_width ?? 200;
        const _max_height = max_height ?? 200;

        const ctx = document.createElement("canvas").getContext("2d");

        const ratio = original_width / original_height;

        let width, height;
        if (ratio >= 1) {
            width = _max_width > original_width ? original_width : _max_width;
            height = width / ratio;
        } else {
            height = _max_height > original_height ? original_height : _max_height;
            width = height * ratio;
        }

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        return ctx;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {string | null} type
     * @param {number | null} quality
     * @returns {Promise<Photo>}
     */
    async #ctxToPhoto(ctx, type = null, quality = null) {
        return this.#blobToPhoto(
            await new Promise(resolve => ctx.canvas.toBlob(resolve, type ?? "image/webp", quality ?? 0.1))
        );
    }

    /**
     * @param {Photo} photo
     * @param {string | null} type
     * @returns {string}
     */
    #photoToDataUrl(photo, type = null) {
        return `data:${type ?? "image/webp"};base64,${btoa(photo.map(char => String.fromCharCode(char)).join(""))}`;
    }

    /**
     * @param {Photo} photo
     * @param {string | null} name
     * @param {string | null} type
     * @returns {File}
     */
    #photoToFile(photo, name = null, type = null) {
        const _type = type ?? "image/webp";

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
    async #photoToImageElement(photo, type = null) {
        return new Promise((resolve, reject) => {
            const image_element = new Image();

            image_element.addEventListener("load", () => {
                resolve(image_element);
            });

            image_element.addEventListener("error", e => {
                reject(e);
            });

            image_element.src = this.#photoToDataUrl(
                photo,
                type
            );
        });
    }

    /**
     * @param {HTMLInputElement} input_element
     * @param {Photo} photo
     * @param {string | null} name
     * @param {string | null} type
     * @returns {void}
     */
    #photoToInputElement(input_element, photo, name = null, type = null) {
        const data_transfer = new DataTransfer();
        data_transfer.items.add(this.#photoToFile(
            photo,
            name,
            type
        ));
        input_element.files = data_transfer.files;
    }

    /**
     * @returns {void}
     */
    #removePhoto() {
        this.#photo = null;
        this.#form_element.inputs.photo.value = "";
        this.#image_element.src = "";
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Portrait"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Portrait"
            )
        );

        const input_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Photo"
            ),
            "file",
            "photo"
        );
        input_element.accept = "image/*";
        input_element.addEventListener("input", () => {
            this.#setPhoto(
                input_element.files[0] ?? null
            );
        });

        this.#image_element = new Image();
        this.#image_element.style.maxWidth = "100%";
        input_element.parentElement.parentElement.parentElement.appendChild(this.#image_element);

        this.#form_element.addButtons(
            () => {
                this.#chosenPortrait();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
        ));

        if (this.#portrait.values !== null) {
            if (this.#portrait.values.photo !== null) {
                this.#photoToInputElement(
                    input_element,
                    this.#portrait.values.photo
                );
                input_element.dispatchEvent(new Event("input"));
            }
        }
    }

    /**
     * @param {Photo | Blob | null} photo
     * @returns {Promise<void>}
     */
    async #setPhoto(photo = null) {
        this.#removePhoto();

        if (photo === null) {
            return;
        }

        const loading_element = this.#get_loading_element();

        try {
            let type = null;

            let _photo;
            if (photo instanceof Blob) {
                ({
                    type
                } = photo);

                _photo = await this.#blobToPhoto(
                    photo
                );
            } else {
                _photo = photo;
            }

            const image_element = await this.#photoToImageElement(
                _photo,
                type
            );

            const ctx = this.#createCtx(
                image_element.naturalWidth,
                image_element.naturalHeight
            );

            ctx.filter = "grayscale(1)";
            ctx.drawImage(image_element, 0, 0, image_element.naturalWidth, image_element.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
            this.#photo = await this.#ctxToPhoto(
                ctx
            );

            this.#image_element.src = this.#photoToDataUrl(
                this.#photo
            );

            this.#photoToInputElement(
                this.#form_element.inputs.photo,
                this.#photo
            );
        } catch (error) {
            console.error(error);

            this.#removePhoto();

            this.#form_element.setCustomValidationMessage(
                this.#form_element.inputs.photo,
                this.#localization_api.translate(
                    "The photo could not been loaded!"
                )
            );
        } finally {
            loading_element.remove();
        }
    }
}

export const PORTRAIT_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_PORTRAIT}`;

customElements.define(PORTRAIT_ELEMENT_TAG_NAME, PortraitElement);
