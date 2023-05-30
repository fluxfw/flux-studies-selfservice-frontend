import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FormTitleElement.css`
);

export class FormTitleElement extends HTMLElement {
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string}
     */
    #title;

    /**
     * @param {string} title
     * @returns {FormTitleElement}
     */
    static new(title) {
        return new this(
            title
        );
    }

    /**
     * @param {string} title
     * @private
     */
    constructor(title) {
        super();

        this.#title = title;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @param {HTMLElement} element
     * @returns {void}
     */
    addElement(element) {
        this.#shadow.appendChild(element);
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

export const FORM_TITLE_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-title";

customElements.define(FORM_TITLE_ELEMENT_TAG_NAME, FormTitleElement);
