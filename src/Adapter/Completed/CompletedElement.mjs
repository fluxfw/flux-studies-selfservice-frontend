import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { PAGE_COMPLETED } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class CompletedElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
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
     * @param {backFunction | null} back_function
     * @returns {CompletedElement}
     */
    static new(css_api, back_function = null) {
        return new this(
            css_api,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, back_function) {
        super();

        this.#css_api = css_api;
        this.#back_function = back_function;

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
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            "Registration completed"
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            "Thank you for your registration"
        ));

        this.#shadow.appendChild(FormElement.new(
            this.#css_api
        )
            .addButtons(
                null,
                this.#back_function
            ));
    }
}

export const COMPLETED_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_COMPLETED}`;

customElements.define(COMPLETED_TAG_NAME, CompletedElement);
