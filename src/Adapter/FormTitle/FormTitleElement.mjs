import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormTitleElement extends HTMLElement {
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
    #title;

    /**
     * @param {CssApi} css_api
     * @param {string} title
     * @returns {FormTitleElement}
     */
    static new(css_api, title) {
        return new this(
            css_api,
            title
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} title
     * @private
     */
    constructor(css_api, title) {
        super();

        this.#css_api = css_api;
        this.#title = title;

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
        const title_element = document.createElement("span");
        title_element.innerText = this.#title;
        this.#shadow.appendChild(title_element);
    }
}

export const FORM_TITLE_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form-title`;

customElements.define(FORM_TITLE_ELEMENT_TAG_NAME, FormTitleElement);
