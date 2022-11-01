import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("./PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PhotoElement extends HTMLElement {
    /**
     * @type {HTMLDivElement}
     */
    #container_element;
    /**
     * @type {PhotoCrop | null}
     */
    #crop = null;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {HTMLImageElement}
     */
    #image_element;
    /**
     * @type {HTMLDivElement | null}
     */
    #rectangle_element = null;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {MouseEvent | Touch | null}
     */
    #start = null;

    /**
     * @param {CssApi} css_api
     * @returns {PhotoElement}
     */
    static new(css_api) {
        return new this(
            css_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @private
     */
    constructor(css_api) {
        super();

        this.#css_api = css_api;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    disconnectedCallback() {
        this.setImage();
    }

    /**
     * @param {Event} e
     * @returns {void}
     */
    handleEvent(e) {
        switch (e.type) {
            case "mousedown":
            case "touchstart":
                this.#startCrop(
                    e
                );
                break;

            case "mousemove":
            case "touchmove":
                this.#moveCrop(
                    e
                );
                break;

            case "mouseup":
            case "touchend":
                this.#endCrop(
                    e
                );
                break;

            case "touchcancel":
                this.#stopCrop();
                break;

            default:
                break;
        }
    }

    /**
     * @returns {PhotoCrop | null}
     */
    get crop() {
        if (this.#crop === null) {
            return null;
        }

        return {
            x: Math.floor(this.#crop.x * this.#image_element.naturalWidth / 100),
            y: Math.floor(this.#crop.y * this.#image_element.naturalHeight / 100),
            width: Math.ceil(this.#crop.width * this.#image_element.naturalWidth / 100),
            height: Math.ceil(this.#crop.height * this.#image_element.naturalHeight / 100)
        };
    }

    /**
     * @param {string | null} src
     * @returns {void}
     */
    setImage(src = null) {
        this.#crop = null;

        this.#stopCrop();

        this.#image_element.src = src ?? "";
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     * @returns {void}
     */
    #endCrop(e) {
        e.preventDefault();

        if (this.#image_element.src === "") {
            this.#stopCrop();
            return;
        }

        if (e instanceof MouseEvent && e.button !== 0) {
            this.#stopCrop();
            return;
        }

        this.#crop = this.#getCrop(
            e
        );

        this.#stopCrop();
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     * @returns {PhotoCrop | null}
     */
    #getCrop(e) {
        const container_rectangle = this.#container_element.getClientRects()[0] ?? null;

        if (container_rectangle === null) {
            return null;
        }

        if (this.#start.clientX < container_rectangle.left || this.#start.clientX > container_rectangle.right) {
            return null;
        }
        if (this.#start.clientY < container_rectangle.top || this.#start.clientY > container_rectangle.bottom) {
            return null;
        }

        const _e = "TouchEvent" in globalThis && e instanceof TouchEvent ? [
            ...e.touches
        ].find(touch => touch.identifier === this.#start.identifier) ?? e.touches[0] : e;

        const startClientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, this.#start.clientX > _e.clientX ? _e.clientX : this.#start.clientX));
        const clientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, this.#start.clientX < _e.clientX ? _e.clientX : this.#start.clientX));

        const startClientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, this.#start.clientY > _e.clientY ? _e.clientY : this.#start.clientY));
        const clientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, this.#start.clientY < _e.clientY ? _e.clientY : this.#start.clientY));

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
     * @param {MouseEvent | TouchEvent} e
     * @returns {void}
     */
    #moveCrop(e) {
        e.preventDefault();

        if (this.#image_element.src === "") {
            this.#stopCrop();
            return;
        }

        if (e instanceof MouseEvent && e.button !== 0) {
            this.#stopCrop();
            return;
        }

        this.#crop = this.#getCrop(
            e
        );

        this.#updateCrop();
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#container_element = document.createElement("div");
        this.#container_element.classList.add("container");

        this.#container_element.appendChild(this.#image_element = new Image());

        this.addEventListener("mousedown", this);
        this.addEventListener("touchstart", this);
        this.#shadow.appendChild(this.#container_element);
    }

    /**
     * @param {MouseEvent | TouchEvent} e
     * @returns {void}
     */
    #startCrop(e) {
        e.preventDefault();

        this.#stopCrop();

        if (this.#image_element.src === "") {
            return;
        }

        if (e instanceof MouseEvent && e.button !== 0) {
            return;
        }

        this.#start = e instanceof TouchEvent ? e.touches[0] : e;

        this.#crop = this.#getCrop(
            this.#start
        );

        this.#updateCrop();

        document.addEventListener("mousemove", this);
        document.addEventListener("touchmove", this);

        document.addEventListener("mouseup", this);
        document.addEventListener("touchend", this);
    }

    /**
     * @returns {void}
     */
    #stopCrop() {
        document.removeEventListener("mousemove", this);
        document.removeEventListener("touchmove", this);

        document.removeEventListener("mouseup", this);
        document.removeEventListener("touchend", this);

        this.#start = null;

        this.#updateCrop();
    }

    /**
     * @returns {void}
     */
    #updateCrop() {
        if (this.#crop === null) {
            if (this.#rectangle_element !== null) {
                this.#rectangle_element.remove();
                this.#rectangle_element = null;
            }
            return;
        }

        if (this.#rectangle_element === null) {
            this.#rectangle_element = document.createElement("div");
            this.#rectangle_element.classList.add("rectangle");
            this.#container_element.appendChild(this.#rectangle_element);
        }

        this.#rectangle_element.style.left = `${this.#crop.x}%`;
        this.#rectangle_element.style.top = `${this.#crop.y}%`;
        this.#rectangle_element.style.width = `${this.#crop.width}%`;
        this.#rectangle_element.style.height = `${this.#crop.height}%`;
    }
}

export const PHOTO_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}-photo`;

customElements.define(PHOTO_ELEMENT_TAG_NAME, PhotoElement);
