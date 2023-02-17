import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { MENU_ID_APPLICATION_LOGIN } from "../Menu/MENU_ID.mjs";

/** @typedef {import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs").ColorSchemeApi} ColorSchemeApi */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../Logout/logoutFunction.mjs").logoutFunction} logoutFunction */
/** @typedef {import("../Menu/Menu.mjs").Menu} Menu */
/** @typedef {import("../Menu/menuFunction.mjs").menuFunction} menuFunction */
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
     * @type {HTMLDivElement}
     */
    #menu_element;
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
     * @param {Menu | null} menu
     * @param {menuFunction | null} menu_function
     * @param {string | null} user_name
     * @param {logoutFunction | null} logout_function
     * @returns {Promise<void>}
     */
    async replaceContent(content_element, menu = null, menu_function = null, user_name = null, logout_function = null) {
        this.#content_element.innerHTML = "";
        this.#content_element.appendChild(content_element);

        this.#menu_element.innerHTML = "";
        if (menu !== null) {
            for (const id of menu.ids) {
                let label;
                switch (id) {
                    case MENU_ID_APPLICATION_LOGIN:
                        label = "Application / Login";
                        break;

                    default:
                        continue;
                }

                const menu_element = document.createElement("div");
                menu_element.classList.add("menu");

                if (id === menu.id) {
                    menu_element.dataset.active = true;
                }

                menu_element.innerText = await this.#localization_api.translate(
                    label
                );
                if (menu_function !== null) {
                    menu_element.addEventListener("click", () => {
                        if (menu_element.dataset.active) {
                            return;
                        }

                        for (const _menu_element of this.#shadow.querySelectorAll(".menu[data-active]")) {
                            delete _menu_element.dataset.active;
                        }

                        menu_element.dataset.active = true;

                        menu_function(
                            id
                        );
                    });
                    this.#menu_element.appendChild(menu_element);
                }
            }
        }

        if (this.#user_element !== null) {
            this.#user_element.remove();
            this.#user_element = null;
        }

        if (user_name !== null || logout_function !== null) {
            this.#user_element = document.createElement("div");
            this.#user_element.classList.add("user");

            if (user_name !== null) {
                const user_name_element = document.createElement("div");
                user_name_element.classList.add("user_name");
                user_name_element.innerText = user_name;
                this.#user_element.appendChild(user_name_element);
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
        this.#content_element = document.createElement("div");

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

        this.#menu_element = document.createElement("div");
        left_element.appendChild(this.#menu_element);

        left_element.appendChild(await this.#color_scheme_api.getSelectColorSchemeElement());

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

        this.#header_element.appendChild(await this.#studis_selfservice_frontend_api.getSelectLanguageElement());

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

        this.#content_element.classList.add("content");
        right_element.appendChild(this.#content_element);

        container_element.appendChild(right_element);

        this.#shadow.appendChild(container_element);
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
