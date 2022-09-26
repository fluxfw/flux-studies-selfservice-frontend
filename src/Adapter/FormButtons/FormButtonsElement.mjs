import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";

/** @typedef {import("./FormButton.mjs").FormButton} FormButton */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormButtonsElement extends HTMLElement {
    /**
     * @type {FormButton[]}
     */
    #buttons;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FormButton[]} buttons
     * @param {CssApi} css_api
     * @returns {FormButtonsElement}
     */
    static new(buttons, css_api) {
        return new this(
            buttons,
            css_api
        );
    }

    /**
     * @param {FormButton[]} buttons
     * @param {CssApi} css_api
     * @private
     */
    constructor(buttons, css_api) {
        super();

        this.#buttons = buttons;
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
        for (const button of this.#buttons) {
            const button_element = document.createElement("button");
            button_element.innerText = button.label;
            button_element.type = "button";
            button_element.addEventListener("click", () => {
                button.action();
            });
            this.#shadow.appendChild(button_element);
        }
    }
}

export const FORM_BUTTONS_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form-buttons`;

customElements.define(FORM_BUTTONS_ELEMENT_TAG_NAME, FormButtonsElement);
