import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";

/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./PhotoCrop.mjs").PhotoCrop} PhotoCrop */
/** @typedef {import("../../Service/Photo/Port/PhotoService.mjs").PhotoService} PhotoService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PhotoElement extends HTMLElement {
    /**
     * @type {HTMLDivElement}
     */
    #container_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {HTMLImageElement}
     */
    #image_element;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
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
     * @type {MouseEvent | Touch | null}
     */
    #start = null;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {PhotoService} photo_service
     * @returns {PhotoElement}
     */
    static new(css_api, localization_api, photo_service) {
        return new this(
            css_api,
            localization_api,
            photo_service
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {PhotoService} photo_service
     * @private
     */
    constructor(css_api, localization_api, photo_service) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#photo_service = photo_service;

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
     * @returns {PhotoCrop | null}
     */
    get crop() {
        if (this.#rectangle === null) {
            return null;
        }

        return this.#photo_service.getCropFromRectangle(
            this.#rectangle,
            this.#image_element
        );
    }

    /**
     * @param {string | null} src
     * @returns {void}
     */
    setImage(src = null) {
        this.#removeRectangle();

        this.#image_element.src = src ?? "";
    }

    /**
     * @param {MouseEvent} e
     * @returns {void}
     */
    #mouseDown(e) {
        e.preventDefault();

        this.#stopDrag();

        if (this.#image_element.src === "" || e.button !== 0) {
            return;
        }

        this.#start = e;

        this.#rectangle = this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            this.#start
        );

        this.#updateRectangle();

        document.addEventListener("mousemove", this);
        document.addEventListener("mouseup", this);
    }

    /**
     * @param {MouseEvent} e
     * @returns {void}
     */
    #mouseMove(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "" || e.button !== 0) {
            this.#stopDrag();
            return;
        }

        this.#rectangle = this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            e
        );

        this.#container_element.dataset.no_cursor = true;
        document.body.style.cursor = `${(e.clientX > this.#start.clientX && e.clientY < this.#start.clientY) || (e.clientX < this.#start.clientX && e.clientY > this.#start.clientY) ? "sw" : "nw"}-resize`;

        this.#updateRectangle();
    }

    /**
     * @param {MouseEvent} e
     * @returns {void}
     */
    #mouseUp(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "" || e.button !== 0) {
            this.#stopDrag();
            return;
        }

        this.#rectangle = this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            e
        );

        this.#updateRectangle();

        this.#stopDrag();
    }

    /**
     * @returns {void}
     */
    #removeRectangle() {
        this.#rectangle = null;

        this.#stopDrag();
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#container_element = document.createElement("div");
        this.#container_element.classList.add("container");

        this.#container_element.appendChild(this.#image_element = new Image());

        this.#container_element.addEventListener("mousedown", this);
        this.#container_element.addEventListener("touchcancel", this);
        this.#container_element.addEventListener("touchend", this);
        this.#container_element.addEventListener("touchmove", this);
        this.#container_element.addEventListener("touchstart", this);
        this.#shadow.appendChild(this.#container_element);

        this.#shadow.appendChild(
            FormSubtitleElement.new(
                this.#css_api,
                this.#localization_api.translate(
                    "The photo can crop by dragging a rectangle with holding primary mouse button or touchscreen. The selection is croped on continue"
                )
            )
        );

        this.#remove_crop_element = FormButtonElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Remove crop"
            )
        );
        this.#remove_crop_element.button.disabled = true;
        this.#remove_crop_element.button.addEventListener("click", () => {
            this.#removeRectangle();
        });
        this.#shadow.appendChild(this.#remove_crop_element);
    }

    /**
     * @returns {void}
     */
    #stopDrag() {
        document.removeEventListener("mousemove", this);
        document.removeEventListener("mouseup", this);

        this.#start = null;

        delete this.#container_element.dataset.no_cursor;
        document.body.style.cursor = "";

        this.#updateRectangle();
    }

    /**
     * @param {TouchEvent} e
     * @returns {void}
     */
    #touchEnd(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "") {
            this.#stopDrag();
            return;
        }

        /*this.#rectangle = this.#photo_service.getRectangle(
            this.#container_element,
            this.#start,
            [
                ...e.touches
            ].find(touch => touch.identifier === this.#start.identifier) ?? e.touches[0]
        );

        this.#updateRectangle();*/

        this.#stopDrag();
    }

    /**
     * @param {TouchEvent} e
     * @returns {void}
     */
    #touchMove(e) {
        e.preventDefault();

        if (this.#start === null || this.#image_element.src === "") {
            this.#stopDrag();
            return;
        }

        this.#rectangle = this.#photo_service.getRectangleFromEvent(
            this.#container_element,
            this.#start,
            [
                ...e.touches
            ].find(touch => touch.identifier === this.#start.identifier) ?? e.touches[0]
        );

        this.#updateRectangle();
    }

    /**
     * @param {TouchEvent} e
     * @returns {void}
     */
    #touchStart(e) {
        e.preventDefault();

        this.#stopDrag();

        if (this.#image_element.src === "") {
            return;
        }

        [
            this.#start
        ] = e.touches;

        /*this.#rectangle = this.#photo_service.getRectangle(
            this.#container_element,
            this.#start,
            this.#start
        );

        this.#updateRectangle();*/
    }

    /**
     * @returns {void}
     */
    #updateRectangle() {
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
            this.#container_element.appendChild(this.#rectangle_element);
            this.#remove_crop_element.button.disabled = false;
        }

        this.#rectangle_element.style.left = `${this.#rectangle.x}%`;
        this.#rectangle_element.style.top = `${this.#rectangle.y}%`;
        this.#rectangle_element.style.width = `${this.#rectangle.width}%`;
        this.#rectangle_element.style.height = `${this.#rectangle.height}%`;
    }
}

export const PHOTO_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}-photo`;

customElements.define(PHOTO_ELEMENT_TAG_NAME, PhotoElement);
