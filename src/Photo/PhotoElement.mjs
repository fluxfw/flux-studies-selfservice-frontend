import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";

/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("./PhotoService.mjs").PhotoService} PhotoService */
/** @typedef {import("./PhotoSize.mjs").PhotoSize} PhotoSize */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PhotoElement.css`
);

export class PhotoElement extends HTMLElement {
    /**
     * @type {HTMLDivElement}
     */
    #container_element;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {HTMLImageElement}
     */
    #image_element;
    /**
     * @type {PhotoService}
     */
    #photo_service;
    /**
     * @type {PhotoCrop | null}
     */
    #rectangle = null;
    /**
     * @type {HTMLDivElement | null}
     */
    #rectangle_element = null;
    /**
     * @type {FormButtonElement}
     */
    #remove_crop_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {HTMLDivElement}
     */
    #size_element;
    /**
     * @type {MouseEvent | Touch | null}
     */
    #start = null;
    /**
     * @type {FormSubtitleElement}
     */
    #subtitle_element;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {PhotoService} photo_service
     * @returns {PhotoElement}
     */
    static new(flux_localization_api, photo_service) {
        return new this(
            flux_localization_api,
            photo_service
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {PhotoService} photo_service
     * @private
     */
    constructor(flux_localization_api, photo_service) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#photo_service = photo_service;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {void}
     */
    disconnectedCallback() {
        this.setImage();
    }

    /**
     * @returns {Promise<PhotoCrop | null>}
     */
    async getCrop() {
        if (this.#rectangle === null) {
            return null;
        }

        return this.#photo_service.getCropFromRectangle(
            this.#rectangle,
            this.#image_element
        );
    }

    /**
     * @returns {Promise<PhotoSize | null>}
     */
    async getSize() {
        if (this.#image_element.src === "") {
            return null;
        }

        const crop = await this.getCrop();
        if (crop !== null) {
            return {
                width: crop.width,
                height: crop.height
            };
        }

        return {
            width: this.#image_element.naturalWidth,
            height: this.#image_element.naturalHeight
        };
    }

    /**
     * @param {Event} e
     * @returns {void}
     */
    handleEvent(e) {
        switch (e.type) {
            case "mousedown":
                this.#mouseDown(
                    e
                );
                break;

            case "mousemove":
                this.#mouseMove(
                    e
                );
                break;

            case "mouseup":
                this.#mouseUp(
                    e
                );
                break;

            case "touchcancel":
                this.#stopDrag();
                break;

            case "touchend":
                this.#touchEnd(
                    e
                );
                break;

            case "touchmove":
                this.#touchMove(
                    e
                );
                break;

            case "touchstart":
                this.#touchStart(
                    e
                );
                break;

            default:
                break;
        }
    }

    /**
     * @param {HTMLImageElement | null} image_element
     * @returns {Promise<void>}
     */
    async setImage(image_element = null) {
        await this.#removeRectangle();

        if (image_element !== null) {
            this.#image_element.replaceWith(this.#image_element = image_element);
            this.#subtitle_element.hidden = false;
            this.#remove_crop_element.hidden = false;
        } else {
            this.#image_element.replaceWith(this.#image_element = new Image());
            this.#subtitle_element.hidden = true;
            this.#remove_crop_element.hidden = true;
        }

        await this.#updateRectangle();
    }

    /**
     * @param {MouseEvent} e
     * @returns {Promise<void>}
     */
    async #mouseDown(e) {
        e.preventDefault();

        await this.#stopDrag();

        if (this.#image_element.src === "" || e.button !== 0) {
            return;
        }

        this.#start = e;

        this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            this.#start
        );

        await this.#updateRectangle();

        document.addEventListener("mousemove", this);
        document.addEventListener("mouseup", this);
    }

    /**
     * @param {MouseEvent} e
     * @returns {Promise<void>}
     */
    async #mouseMove(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "" || e.button !== 0) {
            await this.#stopDrag();
            return;
        }

        this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            e
        );

        this.#container_element.dataset.no_cursor = true;
        document.body.style.cursor = `${(e.clientX > this.#start.clientX && e.clientY < this.#start.clientY) || (e.clientX < this.#start.clientX && e.clientY > this.#start.clientY) ? "sw" : "nw"}-resize`;

        await this.#updateRectangle();
    }

    /**
     * @param {MouseEvent} e
     * @returns {Promise<void>}
     */
    async #mouseUp(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "" || e.button !== 0) {
            await this.#stopDrag();
            return;
        }

        this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            e
        );

        await this.#updateRectangle();

        await this.#stopDrag();
    }

    /**
     * @returns {Promise<void>}
     */
    async #removeRectangle() {
        this.#rectangle = null;

        await this.#stopDrag();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#container_element = document.createElement("div");
        this.#container_element.classList.add("container");

        this.#container_element.append(this.#image_element = new Image());

        this.#container_element.addEventListener("mousedown", this);
        this.#container_element.addEventListener("touchcancel", this);
        this.#container_element.addEventListener("touchend", this, {
            passive: false
        });
        this.#container_element.addEventListener("touchmove", this, {
            passive: false
        });
        this.#container_element.addEventListener("touchstart", this, {
            passive: false
        });
        this.#shadow.append(this.#container_element);

        this.#size_element = document.createElement("div");
        this.#size_element.classList.add("size");
        this.#shadow.append(this.#size_element);

        this.#subtitle_element = FormSubtitleElement.new(
            await this.#flux_localization_api.translate(
                "The photo can crop by dragging a rectangle with holding primary mouse button or touchscreen"
            )
        );
        this.#subtitle_element.hidden = true;
        this.#shadow.append(this.#subtitle_element);

        this.#remove_crop_element = FormButtonElement.new(
            await this.#flux_localization_api.translate(
                "Remove crop"
            )
        );
        this.#remove_crop_element.button.disabled = true;
        this.#remove_crop_element.hidden = true;
        this.#remove_crop_element.button.addEventListener("click", () => {
            this.#removeRectangle();
        });
        this.#shadow.append(this.#remove_crop_element);
    }

    /**
     * @returns {Promise<void>}
     */
    async #stopDrag() {
        document.removeEventListener("mousemove", this);
        document.removeEventListener("mouseup", this);

        this.#start = null;

        delete this.#container_element.dataset.no_cursor;
        document.body.style.cursor = "";

        await this.#updateRectangle();
    }

    /**
     * @param {TouchEvent} e
     * @returns {Promise<void>}
     */
    async #touchEnd(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "") {
            await this.#stopDrag();
            return;
        }

        /*this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            Array.from(e.touches).find(touch => touch.identifier === this.#start.identifier) ?? e.touches[0]
        );

        await this.#updateRectangle();*/

        await this.#stopDrag();
    }

    /**
     * @param {TouchEvent} e
     * @returns {Promise<void>}
     */
    async #touchMove(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "") {
            await this.#stopDrag();
            return;
        }

        this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            Array.from(e.touches).find(touch => touch.identifier === this.#start.identifier) ?? e.touches[0]
        );

        await this.#updateRectangle();
    }

    /**
     * @param {TouchEvent} e
     * @returns {Promise<void>}
     */
    async #touchStart(e) {
        e.preventDefault();

        await this.#stopDrag();

        if (this.#image_element.src === "") {
            return;
        }

        [
            this.#start
        ] = e.touches;

        /*this.#rectangle = await this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            this.#start
        );

        await this.#updateRectangle();*/
    }

    /**
     * @returns {Promise<void>}
     */
    async #updateRectangle() {
        const size = await this.getSize();
        this.#size_element.innerText = size !== null ? `${size.width}px x ${size.height}px` : "";

        if (this.#rectangle === null) {
            if (this.#rectangle_element !== null) {
                this.#rectangle_element.remove();
                this.#rectangle_element = null;
                this.#remove_crop_element.button.disabled = true;
            }
            return;
        }

        if (this.#rectangle_element === null) {
            this.#rectangle_element = document.createElement("div");
            this.#rectangle_element.classList.add("rectangle");
            this.#container_element.append(this.#rectangle_element);
            this.#remove_crop_element.button.disabled = false;
        }

        this.#rectangle_element.style.left = `${this.#rectangle.x}%`;
        this.#rectangle_element.style.top = `${this.#rectangle.y}%`;
        this.#rectangle_element.style.width = `${this.#rectangle.width}%`;
        this.#rectangle_element.style.height = `${this.#rectangle.height}%`;
    }
}

export const PHOTO_ELEMENT_TAG_NAME = "flux-studis-selfservice-photo";

customElements.define(PHOTO_ELEMENT_TAG_NAME, PhotoElement);
