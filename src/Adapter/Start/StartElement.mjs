import { CreateElement } from "../Create/CreateElement.mjs";
import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { ELEMENT_START } from "../Element/ELEMENT.mjs";
import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { ResumeElement } from "../Resume/ResumeElement.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Create/createFunction.mjs").createFunction} createFunction */
/** @typedef {import("../Resume/resumeFunction.mjs").resumeFunction} resumeFunction */
/** @typedef {import("./Start.mjs").Start} Start */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class StartElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
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
     * @param {CssApi} css_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @returns {StartElement}
     */
    static new(css_api, start, create_function, resume_function, back_function = null) {
        return new this(
            css_api,
            start,
            create_function,
            resume_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {Start} start
     * @param {createFunction} create_function
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, start, create_function, resume_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#start = start;
        this.#create_function = create_function;
        this.#resume_function = resume_function;
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
            "Application / Login"
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            "Create a new application by entering a password of you choice, or continue with your application by using your application identification number and your password."
        ));

        this.#shadow.appendChild(CreateElement.new(
            this.#css_api,
            this.#start,
            this.#create_function
        ));

        this.#shadow.appendChild(ResumeElement.new(
            this.#css_api,
            this.#start,
            this.#resume_function,
            this.#back_function
        ));

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));
    }
}

export const START_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${ELEMENT_START}`;

customElements.define(START_ELEMENT_TAG_NAME, StartElement);
