import { CreateElement } from "../Create/CreateElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_START } from "../Page/PAGE.mjs";
import { ResumeElement } from "../Resume/ResumeElement.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../Create/createFunction.mjs").createFunction} createFunction */
/** @typedef {import("../Libs/flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../Password/Port/PasswordService.mjs").PasswordService} PasswordService */
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
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {PasswordService}
     */
    #password_service;
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
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {LabelService} password_service
     * @param {Start} start
     * @param {createFunction} create_function
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @returns {StartElement}
     */
    static new(flux_css_api, flux_localization_api, label_service, password_service, start, create_function, resume_function, back_function = null) {
        return new this(
            flux_css_api,
            flux_localization_api,
            label_service,
            password_service,
            start,
            create_function,
            resume_function,
            back_function
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {LabelService} password_service
     * @param {Start} start
     * @param {createFunction} create_function
     * @param {resumeFunction} resume_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_css_api, flux_localization_api, label_service, password_service, start, create_function, resume_function, back_function) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#password_service = password_service;
        this.#start = start;
        this.#create_function = create_function;
        this.#resume_function = resume_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Login"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#flux_css_api,
            await this.#flux_localization_api.translate(
                "Create a new application by entering a password of you choice, or continue with your application by using your application identification number and your password"
            )
        ));

        this.#shadow.appendChild(CreateElement.new(
            this.#flux_css_api,
            this.#label_service,
            this.#flux_localization_api,
            this.#password_service,
            this.#start,
            this.#create_function
        ));

        this.#shadow.appendChild(ResumeElement.new(
            this.#flux_css_api,
            this.#label_service,
            this.#flux_localization_api,
            this.#password_service,
            this.#start,
            this.#resume_function,
            this.#back_function
        ));

        this.#shadow.appendChild(MandatoryElement.new(
            this.#flux_css_api,
            this.#flux_localization_api
        ));
    }
}

export const START_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_START}`;

customElements.define(START_ELEMENT_TAG_NAME, StartElement);
