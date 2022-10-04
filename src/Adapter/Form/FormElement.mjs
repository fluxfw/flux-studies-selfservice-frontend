import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonsElement } from "../FormButtons/FormButtonsElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";
import { FormTitleElement } from "../FormTitle/FormTitleElement.mjs";

/** @typedef {import("./customValidationFunction.mjs").customValidationFunction} customValidationFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./formButtonAction.mjs").formButtonAction} formButtonAction */
/** @typedef {import("./InputElement.mjs").InputElement} InputElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormElement extends HTMLElement {
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
     * @param {CssApi} css_api
     * @param {customValidationFunction | null} custom_validation_function
     * @returns {FormElement}
     */
    static new(css_api, custom_validation_function = null) {
        return new this(
            css_api,
            custom_validation_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {customValidationFunction | null} custom_validation_function
     * @private
     */
    constructor(css_api, custom_validation_function) {
        super();

        this.#css_api = css_api;
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
     * @param {formButtonAction} continue_function
     * @param {formButtonAction | null} back_function
     * @param {string | null} subtitle
     * @returns {FormButtonsElement}
     */
    addButtons(continue_function, back_function = null, subtitle = null) {
        const buttons_element = FormButtonsElement.new(
            this.#css_api,
            [
                {
                    label: "Continue",
                    action: continue_function,
                    right: true
                },
                ...back_function !== null ? [
                    {
                        label: "Back",
                        action: back_function
                    }
                ] : []
            ],
            subtitle
        );
        this.#shadow.appendChild(buttons_element);
        return buttons_element;
    }

    /**
     * @param {string} label
     * @param {string} type
     * @param {string | null} name
     * @param {boolean} seperate
     * @returns {InputElement}
     */
    addInput(label, type, name = null, seperate = false) {
        const label_element = document.createElement("label");

        if (seperate) {
            label_element.dataset.seperate = true;
        }

        let input_element;
        if (type === "readonly") {
            input_element = document.createElement("div");
            input_element.classList.add("input_readonly");
        } else {
            if (type === "select" || type === "textarea") {
                input_element = document.createElement(type);
                input_element.classList.add(`input_${type}`);
            } else {
                input_element = document.createElement("input");
                input_element.classList.add("input");
                input_element.type = type;
            }
            input_element.name = name ?? "";
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
     * @returns {FormSubtitleElement}
     */
    addSubtitle(subtitle) {
        const subtitle_element = FormSubtitleElement.new(
            this.#css_api,
            subtitle
        );
        this.#form_element.appendChild(subtitle_element);
        return subtitle_element;
    }

    /**
     * @param {string} title
     * @returns {FormTitleElement}
     */
    addTitle(title) {
        const title_element = FormTitleElement.new(
            this.#css_api,
            title
        );
        this.#shadow.prepend(title_element);
        return title_element;
    }

    /**
     * @returns {void}
     */
    clearInputs() {
        for (const label_element of this.#form_element.querySelectorAll("label")) {
            label_element.remove();
        }
    }

    /**
     * @param {HTMLSelectElement} select_element
     * @returns {void}
     */
    clearSelectOptions(select_element) {
        for (const option_element of [
            ...select_element.options
        ].filter(_option_element => _option_element.value !== "")) {
            option_element.remove();
        }
    }

    /**
     * @param {string} name
     * @returns {InputElement[]}
     */
    getGroupedInputs(name) {
        return name in this.inputs ? this.inputs[name] instanceof RadioNodeList ? [
            ...this.inputs[name]
        ] : [
            this.inputs[name]
        ] : [];
    }

    /**
     * @param {string} name
     * @returns {{[key: string]: InputElement}}
     */
    getStartsWithInputs(name) {
        return Object.fromEntries(Object.values(this.inputs).filter(input_element => input_element.name.startsWith(name)).map(input_element => [
            input_element.name.substring(name.length),
            input_element
        ]));
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
        this.#shadow.appendChild(this.#form_element = document.createElement("form"));
        this.#form_element.addEventListener("input", () => {
            this.#removeCustomValidationMessages();
        });
    }
}

export const FORM_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}form`;

customElements.define(FORM_ELEMENT_TAG_NAME, FormElement);
