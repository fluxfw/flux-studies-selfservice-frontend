import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";

/** @typedef {import("./FormButton.mjs").FormButton} FormButton */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FormButtonsElement.css`
);

export class FormButtonsElement extends HTMLElement {
    /**
     * @type {FormButton[]}
     */
    #buttons;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string | null}
     */
    #subtitle = null;

    /**
     * @param {FormButton[]} buttons
     * @param {string | null} subtitle
     * @returns {FormButtonsElement}
     */
    static new(buttons, subtitle = null) {
        return new this(
            buttons,
            subtitle
        );
    }

    /**
     * @param {FormButton[]} buttons
     * @param {string | null} subtitle
     * @private
     */
    constructor(buttons, subtitle) {
        super();

        this.#buttons = buttons;
        this.#subtitle = subtitle;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        if (this.#subtitle !== null) {
            this.#shadow.appendChild(FormSubtitleElement.new(
                this.#subtitle
            ));
        }

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        for (const button of this.#buttons) {
            const button_element = FormButtonElement.new(
                button.label
            );
            if (button.right ?? false) {
                button_element.dataset.right = true;
            }
            button_element.button.addEventListener("click", () => {
                button.action();
            });
            buttons_element.appendChild(button_element);
        }

        this.#shadow.appendChild(buttons_element);
    }
}

export const FORM_BUTTONS_ELEMENT_TAG_NAME = "flux-studis-selfservice-form-buttons";

customElements.define(FORM_BUTTONS_ELEMENT_TAG_NAME, FormButtonsElement);
