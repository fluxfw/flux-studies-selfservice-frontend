import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonsElement } from "../FormButtons/FormButtonsElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";
import { FormTitleElement } from "../FormTitle/FormTitleElement.mjs";

/** @typedef {import("./customValidationFunction.mjs").customValidationFunction} customValidationFunction */
/** @typedef {import("../FormButtons/FormButton.mjs").FormButton} FormButton */
/** @typedef {import("./InputElement.mjs").InputElement} InputElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormElement extends HTMLElement {
    /**
     * @type {FormButton[] | null}
     */
    #buttons;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {customValidationFunction | null}
     */
    #custom_validation_function;
    /**
     * @type {HTMLFormElement}
     */
    #form_element;
    /**
     * @type {boolean}
     */
    #has_custom_validation_messages;
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
     * @param {FormButton[] | null} buttons
     * @param {customValidationFunction | null} custom_validation_function
     * @returns {FormElement}
     */
    static new(css_api, title, buttons = null, custom_validation_function = null) {
        return new this(
            css_api,
            title,
            buttons,
            custom_validation_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} title
     * @param {FormButton[] | null} buttons
     * @param {customValidationFunction | null} custom_validation_function
     * @private
     */
    constructor(css_api, title, buttons, custom_validation_function) {
        super();

        this.#css_api = css_api;
        this.#title = title;
        this.#buttons = buttons;
        this.#custom_validation_function = custom_validation_function;
        this.#has_custom_validation_messages = false;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {string} label
     * @param {string} name
     * @param {string} type
     * @returns {InputElement}
     */
    addInput(label, name, type) {
        const label_element = document.createElement("label");

        let input_element;
        if (type === "readonly") {
            input_element = document.createElement("div");
            input_element.classList.add("input_readonly");
        } else {
            if (type === "select" || type === "textarea") {
                input_element = document.createElement(type);
            } else {
                input_element = document.createElement("input");
                input_element.type = type;
            }
            input_element.classList.add("input");
            input_element.name = name;
        }

        if (input_element instanceof HTMLSelectElement) {
            const option_element = document.createElement("option");
            option_element.text = "--";
            option_element.value = "";
            input_element.appendChild(option_element);
        }

        label_element.appendChild(input_element);

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = label;
        label_element.appendChild(text_element);

        this.#form_element.appendChild(label_element);

        return input_element;
    }

    /**
     * @param {string} subtitle
     * @returns {void}
     */
    addSubtitle(subtitle) {
        this.#form_element.appendChild(FormSubtitleElement.new(
            this.#css_api,
            subtitle
        ));
    }

    /**
     * @returns {void}
     */
    clearInputs() {
        this.#form_element.querySelectorAll("label").forEach(element => {
            element.remove();
        });
    }

    /**
     * @param {HTMLSelectElement} select_element
     * @returns {void}
     */
    clearSelectOptions(select_element) {
        [
            ...select_element.querySelectorAll("option")
        ].filter(option_element => option_element.value !== "").forEach(option_element => {
            option_element.remove();
        });
    }

    /**
     * @returns {{[key: string]: InputElement}}
     */
    get inputs() {
        return this.#form_element.elements;
    }

    /**
     * @param {InputElement} input_element
     * @param {string} message
     * @returns {void}
     */
    setCustomValidationMessage(input_element, message) {
        this.#has_custom_validation_messages = true;

        input_element.setCustomValidity(message);
        input_element.reportValidity();
    }

    /**
     * @returns {boolean}
     */
    validate() {
        this.#removeCustomValidationMessages();

        if (!this.#form_element.checkValidity()) {
            this.#form_element.reportValidity();
            return false;
        }

        if (this.#custom_validation_function !== null && !this.#custom_validation_function()) {
            return false;
        }

        return true;
    }

    /**
     * @returns {void}
     */
    #removeCustomValidationMessages() {
        if (!this.#has_custom_validation_messages) {
            return;
        }

        this.#has_custom_validation_messages = false;

        for (const input_element of this.#form_element.elements) {
            input_element.setCustomValidity("");
        }
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(FormTitleElement.new(
            this.#css_api,
            this.#title
        ));

        this.#shadow.appendChild(this.#form_element = document.createElement("form"));
        this.#form_element.addEventListener("input", () => {
            this.#removeCustomValidationMessages();
        });

        if (this.#buttons !== null) {
            this.#shadow.appendChild(FormButtonsElement.new(
                this.#buttons,
                this.#css_api
            ));
        }
    }
}

export const FORM_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form`;

customElements.define(FORM_ELEMENT_TAG_NAME, FormElement);
