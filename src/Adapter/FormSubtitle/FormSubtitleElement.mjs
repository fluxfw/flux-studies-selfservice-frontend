import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormSubtitleElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string}
     */
    #subtitle;

    /**
     * @param {CssApi} css_api
     * @param {string} subtitle
     * @returns {FormSubtitleElement}
     */
    static new(css_api, subtitle) {
        return new this(
            css_api,
            subtitle
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} subtitle
     * @private
     */
    constructor(css_api, subtitle) {
        super();

        this.#css_api = css_api;
        this.#subtitle = subtitle;

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
    #render() {
        const subtitle_element = document.createElement("span");
        subtitle_element.innerText = this.#subtitle;
        this.#shadow.appendChild(subtitle_element);
    }
}

export const FORM_SUBTITLE_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form-subtitle`;

customElements.define(FORM_SUBTITLE_ELEMENT_TAG_NAME, FormSubtitleElement);
