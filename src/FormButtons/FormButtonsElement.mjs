import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";

/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("./FormButton.mjs").FormButton} FormButton */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormButtonsElement extends HTMLElement {
    /**
     * @type {FormButton[]}
     */
    #buttons;
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {string | null}
     */
    #subtitle = null;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FormButton[]} buttons
     * @param {string | null} subtitle
     * @returns {FormButtonsElement}
     */
    static new(flux_css_api, buttons, subtitle = null) {
        return new this(
            flux_css_api,
            buttons,
            subtitle
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FormButton[]} buttons
     * @param {string | null} subtitle
     * @private
     */
    constructor(flux_css_api, buttons, subtitle) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#buttons = buttons;
        this.#subtitle = subtitle;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        if (this.#subtitle !== null) {
            this.#shadow.appendChild(FormSubtitleElement.new(
                this.#flux_css_api,
                this.#subtitle
            ));
        }

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        for (const button of this.#buttons) {
            const button_element = FormButtonElement.new(
                this.#flux_css_api,
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
