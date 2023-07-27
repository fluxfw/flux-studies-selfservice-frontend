import { flux_import_css } from "../Libs/flux-style-sheet-manager/src/FluxImportCss.mjs";

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FormButtonElement.css`
);

export class FormButtonElement extends HTMLElement {
    /**
     * @type {HTMLButtonElement}
     */
    #button_element;
    /**
     * @type {string}
     */
    #label;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {string} label
     * @returns {FormButtonElement}
     */
    static new(label) {
        return new this(
            label
        );
    }

    /**
     * @param {string} label
     * @private
     */
    constructor(label) {
        super();

        this.#label = label;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {HTMLButtonElement}
     */
    get button() {
        return this.#button_element;
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#button_element = document.createElement("button");
        this.#button_element.innerText = this.#label;
        this.#button_element.type = "button";
        this.#shadow.append(this.#button_element);
    }
}

export const FORM_BUTTON_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-button";

customElements.define(FORM_BUTTON_ELEMENT_TAG_NAME, FormButtonElement);
