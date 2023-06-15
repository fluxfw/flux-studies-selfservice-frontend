import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormButtonsElement } from "../FormButtons/FormButtonsElement.mjs";
import { FormInvalidElement } from "../FormInvalid/FormInvalidElement.mjs";
import { FormSubtitleElement } from "../FormSubtitle/FormSubtitleElement.mjs";
import { FormTitleElement } from "../FormTitle/FormTitleElement.mjs";

/** @typedef {import("./customValidationFunction.mjs").customValidationFunction} customValidationFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../FormButtons/formButtonAction.mjs").formButtonAction} formButtonAction */
/** @typedef {import("./InputElement.mjs").InputElement} InputElement */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/FormElement.css`
);

export class FormElement extends HTMLElement {
    /**
     * @type {FormButtonsElement | null}
     */
    #buttons_element = null;
    /**
     * @type {customValidationFunction | null}
     */
    #custom_validation_function;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
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
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {customValidationFunction | null} custom_validation_function
     * @returns {FormElement}
     */
    static new(flux_localization_api, custom_validation_function = null) {
        return new this(
            flux_localization_api,
            custom_validation_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {customValidationFunction | null} custom_validation_function
     * @private
     */
    constructor(flux_localization_api, custom_validation_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#custom_validation_function = custom_validation_function;
        this.#has_custom_validation_messages = false;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

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
            [
                ...continue_function !== null ? [
                    {
                        label: await this.#flux_localization_api.translate(
                            "Continue"
                        ),
                        action: continue_function,
                        right: true
                    }
                ] : [],
                ...back_function !== null ? [
                    {
                        label: await this.#flux_localization_api.translate(
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
            message
        );

        this.#invalid_messages ??= [];
        this.#invalid_messages.unshift(invalid_element);

        this.#form_element.prepend(invalid_element);

        invalid_element.scrollIntoView({
            block: "nearest",
            inline: "nearest"
        });

        return invalid_element;
    }

    /**
     * @param {string} subtitle
     * @returns {FormSubtitleElement}
     */
    addSubtitle(subtitle) {
        const subtitle_element = FormSubtitleElement.new(
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
        for (const option_element of Array.from(select_element.options).filter(option_element => option_element.value !== "")) {
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

export const FORM_ELEMENT_TAG_NAME = "flux-studis-selfservice-form";

customElements.define(FORM_ELEMENT_TAG_NAME, FormElement);
