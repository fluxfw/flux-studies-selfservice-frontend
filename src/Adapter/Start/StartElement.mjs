import { CreateElement } from "../Create/CreateElement.mjs";
import { CssApi } from "../../../../flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_START } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { ResumeElement } from "../Resume/ResumeElement.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Create/createFunction.mjs").createFunction} createFunction */
/** @typedef {import("../Resume/resumeFunction.mjs").resumeFunction} resumeFunction */
/** @typedef {import("./Start.mjs").Start} Start */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class StartElement extends HTMLElement {
    /**
     * @type {createFunction}
     */
    #create_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {resumeFunction}
     */
    #resume_function;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {Start}
     */
    #start;

    /**
     * @param {createFunction} create_function
     * @param {CssApi} css_api
     * @param {resumeFunction} resume_function
     * @param {Start} start
     * @returns {StartElement}
     */
    static new(create_function, css_api, resume_function, start) {
        return new this(
            create_function,
            css_api,
            resume_function,
            start
        );
    }

    /**
     * @param {createFunction} create_function
     * @param {CssApi} css_api
     * @param {resumeFunction} resume_function
     * @param {Start} start
     * @private
     */
    constructor(create_function, css_api, resume_function, start) {
        super();

        this.#create_function = create_function;
        this.#css_api = css_api;
        this.#resume_function = resume_function;
        this.#start = start;

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
            "Application / Login"
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            "Create a new application by entering a password of you choice, or continue with your application by using your application identification number and your password."
        ));

        this.#shadow.appendChild(CreateElement.new(
            this.#create_function,
            this.#css_api,
            this.#start
        ));

        this.#shadow.appendChild(ResumeElement.new(
            this.#css_api,
            this.#resume_function
        ));

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));
    }
}

export const START_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_START}`;

customElements.define(START_ELEMENT_TAG_NAME, StartElement);
