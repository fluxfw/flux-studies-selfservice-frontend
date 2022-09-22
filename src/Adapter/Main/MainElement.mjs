import { CssApi } from "../../../../flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MainElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @returns {MainElement}
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
     * @param {HTMLElement} element
     * @returns {void}
     */
    replaceContent(element) {
        this.#shadow.lastElementChild.replaceWith(element);
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(document.createElement("div"));
    }
}

export const MAIN_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}main`;

customElements.define(MAIN_ELEMENT_TAG_NAME, MainElement);
