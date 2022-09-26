import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MandatoryElement extends HTMLElement {
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
     * @returns {MandatoryElement}
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
    #render() {
        const mandatory_element = document.createElement("span");
        mandatory_element.innerText = "Mandatory";
        this.#shadow.appendChild(mandatory_element);
    }
}

export const MANDATORY_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}mandatory`;

customElements.define(MANDATORY_ELEMENT_TAG_NAME, MandatoryElement);
