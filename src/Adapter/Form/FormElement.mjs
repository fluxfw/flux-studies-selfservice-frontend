import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormButtonsElement } from "../FormButtons/FormButtonsElement.mjs";
import { FormInvalidElement } from "../FormInvalid/FormInvalidElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";
import { FormTitleElement } from "../FormTitle/FormTitleElement.mjs";

/** @typedef {import("./customValidationFunction.mjs").customValidationFunction} customValidationFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./formButtonAction.mjs").formButtonAction} formButtonAction */
/** @typedef {import("./InputElement.mjs").InputElement} InputElement */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FormElement extends HTMLElement {
    /**
     * @type {FormButtonsElement | null}
     */
    #buttons_element = null;
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
     * @type {FormInvalidElement[] | null}
     */
    #invalid_messages = null;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {customValidationFunction | null} custom_validation_function
     * @returns {FormElement}
     */
    static new(css_api, localization_api, custom_validation_function = null) {
        return new this(
            css_api,
            localization_api,
            custom_validation_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {customValidationFunction | null} custom_validation_function
     * @private
     */
    constructor(css_api, localization_api, custom_validation_function) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
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
     * @param {formButtonAction | null} continue_function
     * @param {formButtonAction | null} back_function
     * @param {string | null} subtitle
     * @returns {Promise<FormButtonsElement>}
     */
    async addButtons(continue_function = null, back_function = null, subtitle = null) {
        this.removeButtons();

        this.#buttons_element = FormButtonsElement.new(
            this.#css_api,
            [
                ...continue_function !== null ? [
                    {
                        label: await this.#localization_api.translate(
                            "Continue"
                        ),
                        action: continue_function,
                        right: true
                    }
                ] : [],
                ...back_function !== null ? [
                    {
                        label: await this.#localization_api.translate(
                            "Back"
                        ),
                        action: back_function
                    }
                ] : []
            ],
            subtitle
        );
        this.#shadow.appendChild(this.#buttons_element);
        return this.#buttons_element;
    }

    /**
     * @param {string} label
     * @param {string} type
     * @param {string | null} name
     * @param {boolean} seperate
     * @param {boolean} container
     * @returns {InputElement}
     */
    addInput(label, type, name = null, seperate = false, container = false) {
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
                if (type !== "checkbox" && type !== "radio") {
                    input_element.classList.add("input_field");
                }
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

        if (container) {
            const container_element = document.createElement("div");
            container_element.classList.add("input_container");

            container_element.appendChild(input_element);

            if (type === "file") {
                const remove_element = FormButtonElement.new(
                    this.#css_api,
                    "X"
                );
                remove_element.button.disabled = true;
                remove_element.button.addEventListener("click", () => {
                    input_element.value = "";
                    input_element.dispatchEvent(new Event("input"));
                });

                input_element.addEventListener("input", () => {
                    remove_element.button.disabled = input_element.files.length < 1;
                });

                container_element.appendChild(remove_element);
            }

            label_element.appendChild(container_element);
        } else {
            label_element.appendChild(input_element);
        }

        const text_element = document.createElement("div");
        text_element.classList.add("text");
        text_element.innerText = label;
        label_element.appendChild(text_element);

        this.#form_element.appendChild(label_element);

        return input_element;
    }

    /**
     * @param {string} message
     * @returns {FormInvalidElement}
     */
    addInvalidMessage(message) {
        const invalid_element = FormInvalidElement.new(
            this.#css_api,
            message
        );

        this.#invalid_messages ??= [];
        this.#invalid_messages.unshift(invalid_element);

        this.#form_element.prepend(invalid_element);

        invalid_element.scrollIntoView({ block: "nearest", inline: "nearest" });

        return invalid_element;
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
    getInputsByName(name) {
        return Object.values(this.inputs).filter(input_element => input_element.name === name);
    }

    /**
     * @param {string} name
     * @returns {{[key: string]: InputElement}}
     */
    getInputsByNameStartsWith(name) {
        return Object.fromEntries(Object.values(this.inputs).filter(input_element => input_element.name.startsWith(name)).map(input_element => [
            input_element.name.substring(name.length),
            input_element
        ]));
    }

    /**
     * @param {string} name
     * @returns {string}
     */
    getTextareaValue(name) {
        return this.inputs[name].value.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
    }

    /**
     * @returns {{[key: string]: InputElement}}
     */
    get inputs() {
        return this.#form_element.elements;
    }

    /**
     * @returns {void}
     */
    removeButtons() {
        if (this.#buttons_element !== null) {
            this.#buttons_element.remove();
            this.#buttons_element = null;
        }
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
     * @returns {Promise<boolean>}
     */
    async validate() {
        this.#removeCustomValidationMessages();
        this.#removeInvalidMessages();

        if (!this.#form_element.checkValidity()) {
            this.#form_element.reportValidity();
            return false;
        }

        if (this.#custom_validation_function !== null && !await this.#custom_validation_function()) {
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
    #removeInvalidMessages() {
        if (this.#invalid_messages === null) {
            return;
        }

        for (const invalid_element of this.#invalid_messages) {
            invalid_element.remove();
        }

        this.#invalid_messages = null;
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
