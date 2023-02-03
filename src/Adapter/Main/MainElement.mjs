import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";

/** @typedef {import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs").ColorSchemeApi} ColorSchemeApi */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../Post/logoutFunction.mjs").logoutFunction} logoutFunction */
/** @typedef {import("../Api/StudisSelfserviceFrontendApi.mjs").StudisSelfserviceFrontendApi} StudisSelfserviceFrontendApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MainElement extends HTMLElement {
    /**
     * @type {ColorSchemeApi}
     */
    #color_scheme_api;
    /**
     * @type {HTMLElement}
     */
    #content_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {HTMLDivElement}
     */
    #header_element;
    /**
     * @type {Layout}
     */
    #layout;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {StudisSelfserviceFrontendApi}
     */
    #studis_selfservice_frontend_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {HTMLDivElement | null}
     */
    #user_element = null;

    /**
     * @param {ColorSchemeApi} color_scheme_api
     * @param {CssApi} css_api
     * @param {Layout} layout
     * @param {LocalizationApi} localization_api
     * @param {StudisSelfserviceFrontendApi} studis_selfservice_frontend_api
     * @returns {MainElement}
     */
    static new(color_scheme_api, css_api, layout, localization_api, studis_selfservice_frontend_api) {
        return new this(
            color_scheme_api,
            css_api,
            layout,
            localization_api,
            studis_selfservice_frontend_api
        );
    }

    /**
     * @param {ColorSchemeApi} color_scheme_api
     * @param {CssApi} css_api
     * @param {Layout} layout
     * @param {LocalizationApi} localization_api
     * @param {StudisSelfserviceFrontendApi} studis_selfservice_frontend_api
     * @private
     */
    constructor(color_scheme_api, css_api, layout, localization_api, studis_selfservice_frontend_api) {
        super();

        this.#color_scheme_api = color_scheme_api;
        this.#css_api = css_api;
        this.#layout = layout;
        this.#localization_api = localization_api;
        this.#studis_selfservice_frontend_api = studis_selfservice_frontend_api;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {HTMLElement} content_element
     * @param {string | null} identification_number
     * @param {logoutFunction | null} logout_function
     * @returns {Promise<void>}
     */
    async replaceContent(content_element, identification_number = null, logout_function = null) {
        this.#content_element.innerHTML = "";
        this.#content_element.appendChild(content_element);

        if (this.#user_element !== null) {
            this.#user_element.remove();
            this.#user_element = null;
        }

        if (identification_number !== null || logout_function !== null) {
            this.#user_element = document.createElement("div");
            this.#user_element.classList.add("user");

            if (identification_number !== null) {
                const identification_number_element = document.createElement("div");
                identification_number_element.classList.add("identification_number");
                identification_number_element.innerText = identification_number;
                this.#user_element.appendChild(identification_number_element);
            }

            if (logout_function !== null) {
                const logout_button_element = FormButtonElement.new(
                    this.#css_api,
                    await this.#localization_api.translate(
                        "Logout"
                    )
                );
                logout_button_element.button.addEventListener("click", () => {
                    logout_function();
                });
                this.#user_element.appendChild(logout_button_element);
            }

            this.#header_element.appendChild(this.#user_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const container_element = document.createElement("div");
        container_element.classList.add("container");

        const left_element = document.createElement("div");
        left_element.classList.add("left");

        const title_element = document.createElement("div");
        title_element.classList.add("title");
        title_element.innerText = await this.#localization_api.translate(
            "Studis selfservice"
        );
        left_element.appendChild(title_element);

        const menu_element = document.createElement("div");
        menu_element.classList.add("menu");
        menu_element.dataset.active = true;
        menu_element.innerText = await this.#localization_api.translate(
            "Application / Login"
        );
        left_element.appendChild(menu_element);

        const select_color_scheme_placeholder_element = document.createElement("div");
        select_color_scheme_placeholder_element.hidden = true;
        left_element.appendChild(select_color_scheme_placeholder_element);

        const logo_link_element = document.createElement("a");
        logo_link_element.classList.add("logo");
        logo_link_element.href = this.#layout["logo-link"];
        logo_link_element.rel = "noopener noreferrer";
        logo_link_element.target = "__blank";
        if (this.#layout["logo-link"] !== "") {
            logo_link_element.title = this.#layout["logo-title"];
        }

        left_element.appendChild(logo_link_element);

        container_element.appendChild(left_element);

        const right_element = document.createElement("div");
        right_element.classList.add("right");

        this.#header_element = document.createElement("div");
        this.#header_element.classList.add("header");

        const select_language_placeholder_element = document.createElement("div");
        select_language_placeholder_element.hidden = true;
        this.#header_element.appendChild(select_language_placeholder_element);

        const print_button_element = FormButtonElement.new(
            this.#css_api,
            await this.#localization_api.translate(
                "Print page"
            )
        );
        print_button_element.button.addEventListener("click", () => {
            this.#print();
        });
        this.#header_element.appendChild(print_button_element);

        right_element.appendChild(this.#header_element);

        const header2_element = document.createElement("div");
        header2_element.classList.add("header2");

        const arrow_element = document.createElement("div");
        arrow_element.classList.add("arrow");
        arrow_element.innerText = await this.#localization_api.translate(
            "Application / Login"
        );
        header2_element.appendChild(arrow_element);

        right_element.appendChild(header2_element);

        this.#content_element = document.createElement("div");
        this.#content_element.classList.add("content");
        right_element.appendChild(this.#content_element);

        container_element.appendChild(right_element);

        this.#shadow.appendChild(container_element);

        (async () => {
            select_color_scheme_placeholder_element.replaceWith(await this.#color_scheme_api.getSelectColorSchemeElement());
        })();

        (async () => {
            select_language_placeholder_element.replaceWith(await this.#studis_selfservice_frontend_api.getSelectLanguageElement());
        })();
    }

    /**
     * @returns {void}
     */
    #print() {
        print();
    }
}

export const MAIN_ELEMENT_TAG_NAME = "flux-studis-selfservice-main";

customElements.define(MAIN_ELEMENT_TAG_NAME, MainElement);
